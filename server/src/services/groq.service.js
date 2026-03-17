const axios = require("axios");

function buildPrompt({ resumeText, jobDescription }) {
  return [
    "You are an expert ATS and resume reviewer.",
    "Analyze the candidate resume and return valid JSON only.",
    "Use this JSON shape exactly:",
    JSON.stringify(
      {
        summary: "Short overall assessment",
        strengths: ["strength 1"],
        gaps: ["gap 1"],
        suggestions: ["suggestion 1"],
        atsKeywords: ["keyword 1"],
        matchScore: 0,
        skillMatch: [
          {
            skill: "React",
            score: 85,
          },
        ],
      },
      null,
      2,
    ),
    "",
    "Resume:",
    resumeText,
    "",
    "Job Description:",
    jobDescription || "Not provided",
  ].join("\n");
}

function normalizeAnalysis(content) {
  const sanitizedContent = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");
  const parsed = JSON.parse(sanitizedContent);

  return {
    summary: parsed.summary || "No summary provided.",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    atsKeywords: Array.isArray(parsed.atsKeywords) ? parsed.atsKeywords : [],
    matchScore: typeof parsed.matchScore === "number" ? parsed.matchScore : 0,
    skillMatch: Array.isArray(parsed.skillMatch)
      ? parsed.skillMatch
          .filter(
            (item) =>
              item &&
              typeof item.skill === "string" &&
              typeof item.score === "number",
          )
          .map((item) => ({
            skill: item.skill,
            score: Math.max(0, Math.min(100, item.score)),
          }))
      : [],
  };
}

async function analyzeResumeWithGroq({ resumeText, jobDescription }) {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("Missing GROQ_API_KEY in server environment.");
    error.statusCode = 500;
    throw error;
  }

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  let response;

  try {
    response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "system",
            content:
              "You analyze resumes for clarity, ATS optimization, and job fit.",
          },
          {
            role: "user",
            content: buildPrompt({ resumeText, jobDescription }),
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (requestError) {
    const errorMessage =
      requestError.response?.data?.error?.message || "Groq API request failed.";
    const error = new Error(errorMessage);
    error.statusCode = requestError.response?.status || 502;
    throw error;
  }

  const content = response.data?.choices?.[0]?.message?.content;

  if (!content) {
    const error = new Error("Groq returned an empty analysis response.");
    error.statusCode = 502;
    throw error;
  }

  try {
    return normalizeAnalysis(content);
  } catch (parseError) {
    const error = new Error("Failed to parse AI analysis response.");
    error.statusCode = 502;
    throw error;
  }
}

module.exports = {
  analyzeResumeWithGroq,
};

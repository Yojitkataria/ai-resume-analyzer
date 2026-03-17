function getApiBaseUrl() {
  const rawBaseUrl = import.meta.env.VITE_API_URL || "";
  return rawBaseUrl.replace(/\/$/, "");
}

export async function analyzeResume({ resumeFile, jobDescription }) {
  const apiBaseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription || "");

  const response = await fetch(`${apiBaseUrl}/api/resume/analyze`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to analyze resume.");
  }

  return data;
}

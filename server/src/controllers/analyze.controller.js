const { analyzeResumeWithGroq } = require("../services/groq.service");
const { extractTextFromPdf } = require("../services/pdf.service");

async function getHealth(req, res) {
  res.json({ ok: true });
}

async function analyzeResume(req, res, next) {
  try {
    const { jobDescription = "" } = req.body;
    const resumeText = await extractTextFromPdf(req.file.buffer);

    const analysis = await analyzeResumeWithGroq({
      resumeText,
      jobDescription,
    });

    res.json({
      ok: true,
      analysis,
      fileName: req.file.originalname,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHealth,
  analyzeResume,
};

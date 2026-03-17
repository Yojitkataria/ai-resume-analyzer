function validateAnalyzeRequest(req, res, next) {
  const { jobDescription } = req.body || {};

  if (!req.file) {
    return res.status(400).json({
      ok: false,
      message: "A PDF resume file is required.",
    });
  }

  if (jobDescription !== undefined && typeof jobDescription !== "string") {
    return res.status(400).json({
      ok: false,
      message: "jobDescription must be a string when provided.",
    });
  }

  next();
}

module.exports = {
  validateAnalyzeRequest,
};

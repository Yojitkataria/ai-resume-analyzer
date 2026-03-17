const express = require("express");

const {
  getHealth,
  analyzeResume,
} = require("../controllers/analyze.controller");
const { upload } = require("../middleware/upload.middleware");
const { validateAnalyzeRequest } = require("../middleware/validate.middleware");

const router = express.Router();

router.get("/health", getHealth);
router.post(
  "/analyze",
  upload.single("resume"),
  validateAnalyzeRequest,
  analyzeResume,
);
router.post(
  "/resume/analyze",
  upload.single("resume"),
  validateAnalyzeRequest,
  analyzeResume,
);

module.exports = router;

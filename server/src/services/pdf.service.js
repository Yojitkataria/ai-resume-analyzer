const { PDFParse } = require("pdf-parse");

async function extractTextFromPdf(fileBuffer) {
  const parser = new PDFParse({ data: fileBuffer });
  const parsedPdf = await parser.getText();
  await parser.destroy();
  const resumeText = parsedPdf.text?.trim();

  if (!resumeText) {
    const error = new Error("Could not extract readable text from the PDF.");
    error.statusCode = 400;
    throw error;
  }

  return resumeText;
}

module.exports = {
  extractTextFromPdf,
};

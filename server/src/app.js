const express = require("express");
const cors = require("cors");

const analyzeRoutes = require("./routes/analyze.routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", analyzeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

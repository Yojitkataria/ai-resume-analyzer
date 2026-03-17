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
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", analyzeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

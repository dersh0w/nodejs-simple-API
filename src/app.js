const express = require("express");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is working!",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Page Not Found",
  });
});

module.exports = app;

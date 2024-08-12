const express = require("express");
const authRouter = require("./routers/auth.router");
const { protectRoute } = require("./controllers/auth.controller");
const toolRouter = require("./routers/tool.router");
const globalErrorHandler = require("./controllers/error.controller");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is working!",
  });
});

app.use("/api", authRouter);
app.use("/api/tools", protectRoute, toolRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Page Not Found",
  });
});

app.use(globalErrorHandler);

module.exports = app;

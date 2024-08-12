const express = require("express");
const morganMiddleware = require("./config/morgan");
const authRouter = require("./routers/auth.router");
const { protectRoute } = require("./controllers/auth.controller");
const toolRouter = require("./routers/tool.router");
const globalErrorHandler = require("./controllers/error.controller");

// Cria o app usando Express
const app = express();

// Configuração do app
app.use(express.json());

app.use(morganMiddleware);

// Rotas
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

// Global Error Handler
app.use(globalErrorHandler);

// Se conecta ao MongoDb
async function startMongoDB() {
  const connection = require("./config/db");

  await connection;
}
startMongoDB();

module.exports = app;

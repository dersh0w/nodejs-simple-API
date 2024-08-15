const express = require("express");
const swaggerUi = require("swagger-ui-express");
const mongoSanitize = require("express-mongo-sanitize");
const morganMiddleware = require("./config/morgan");
const authRouter = require("./routers/auth.router");
const { protectRoute } = require("./controllers/auth.controller");
const toolRouter = require("./routers/tool.router");
const globalErrorHandler = require("./controllers/error.controller");
const logger = require("./config/logger");

// Cria o app usando Express
const app = express();

// Configuração do app
app.use(express.json());

app.use(morganMiddleware);

app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      logger.warn(
        `[WARN] The request ${req.body} from ${req.ip} was sanitized!`
      );
    },
  })
);

// Rotas
(async () => {
  const swaggerDoc = await require("./config/swagger");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
})();

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is working!",
  });
});

app.use("/api", authRouter);
app.use("/api/tools", protectRoute, toolRouter);

// Global Error Handler
app.use(globalErrorHandler);

// Se conecta ao MongoDb
async function startMongoDB() {
  const connection = require("./config/db");

  await connection;
}
startMongoDB();

module.exports = app;

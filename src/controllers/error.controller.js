require("dotenv").config();
const AppError = require("../utils/AppError");
const logger = require("../config/logger");

// Handle possíveis erros
function handleProductionError(error) {
  let err = { ...error };

  if (error.name === "CastError") err = handleCastErrorDB(err);
  if (error.code === 11000) err = handleDuplicateFieldsDB(err.errorResponse);
  if (error.name === "ValidationError") err = handleValidationError(err);
  if (error.name === "JsonWebTokenError") err = handleJWTError();
  if (error.name === "TokenExpiredError") err = handleJWTExpiredError();
  if (error.name === "AppError") err.message = error.message;

  return err;
}

// Error handlers
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}!`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}!`;
  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const errors = err.errors
    ? Object.values(err.errors).map((el) => el.message)
    : Object.values(err.details).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(" ")}`;
  return new AppError(message, 400);
};
const handleJWTError = () => new AppError("Invalid Token!", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired!", 401);

// Retorna erro em produção
function returnErrorProduction(error, res) {
  // Se o erro for operacional, foi tratado
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  // Salva o erro não tratado no arquivo logs/error.log
  logger.error("Production error!");
  logger.error(error);

  // Se não for operacional, printa na tela e retorna um erro genérico
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
}

// Retorna erro em development
function returnErrorDevelopment(error, res) {
  return res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return returnErrorDevelopment(err, res);
  }

  // Handle possíveis erros
  const error = handleProductionError(err);

  return returnErrorProduction(error, res);
};

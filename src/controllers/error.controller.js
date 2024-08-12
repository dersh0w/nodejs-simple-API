require("dotenv").config();
const AppError = require("../utils/AppError");

// Handle possíveis erros
function handleProductionError(error) {
  let err = { ...error };

  console.log(`Name: ${error.name}!`);

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
  console.log(err);
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
const handleJWTError = () => new AppError("Invalid Token!", 400);
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

  // Se não for operacional, printa na tela e retorna um erro genérico
  console.log("Production error:");
  console.log(error);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
}

// Retorna erro em development
function returnErrorDevelopment(error, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
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

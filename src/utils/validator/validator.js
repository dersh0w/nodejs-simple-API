const logger = require("../../config/logger");
const AppError = require("../AppError");

exports.validateData = (objSchema) => {
  return (req, res, next) => {
    try {
      // Validate body
      logger.info("Validating data...");
      const { error } = objSchema.validate(req.body, {
        abortEarly: false,
      });

      // Case error was returned
      if (error) {
        logger.error("Invalid input data!");
        logger.error(error.message);
        return next(new AppError(error.message, 400));
      }

      // Else
      logger.info("Data validated!");
      next();
    } catch (validationErr) {
      logger.error("Validation error!");
      logger.error(validationErr.message);
      return next(new AppError("Server error during validation", 500));
    }
  };
};

exports.validateParameters = (objSchema) => {
  return (req, res, next) => {
    try {
      // Validate parameters
      logger.info("Validating data...");

      const validateSchema = { ...req.query };
      ["fields", "title", "tags"].forEach((key) => {
        if (validateSchema[key]) {
          validateSchema[key] = validateSchema[key].split(",");
        }
      });

      const { error } = objSchema.validate(validateSchema, {
        abortEarly: false,
      });

      // Case error was returned
      if (error) {
        logger.error("Invalid input data!");
        logger.error(error.message);
        return next(new AppError(error.message, 400));
      }

      // Else
      logger.info("Parameters validated!");
      next();
    } catch (validationErr) {
      logger.error("Validation error!");
      logger.error(validationErr.message);
      return next(new AppError("Server error during validation", 500));
    }
  };
};

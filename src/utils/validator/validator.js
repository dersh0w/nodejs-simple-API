const logger = require("../../config/logger");
const AppError = require("../AppError");

exports.validateData = (objSchema) => {
  return (req, res, next) => {
    try {
      // Validate body
      logger.info("Validating data...");
      const { error, value } = objSchema.validate(req.body, {
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
      logger.error(validationErr.message);
      return next(new AppError(validationErr.message), 400);
    }
  };
};

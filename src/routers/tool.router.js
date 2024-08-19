const express = require("express");
const {
  getAllTools,
  createTool,
  getTool,
  updateTool,
  deleteTool,
} = require("../controllers/tool.controller");
const {
  getAllToolsSchema,
  createToolSchema,
  updateToolSchema,
} = require("../utils/validator/tool.validator");
const {
  validateParameters,
  validateData,
} = require("../utils/validator/validator");

const toolRouter = express.Router();

toolRouter
  .route("/")
  .get(validateParameters(getAllToolsSchema), getAllTools)
  .post(validateData(createToolSchema), createTool);

toolRouter
  .route("/:id")
  .get(getTool)
  .put(validateData(updateToolSchema), updateTool)
  .delete(deleteTool);

module.exports = toolRouter;

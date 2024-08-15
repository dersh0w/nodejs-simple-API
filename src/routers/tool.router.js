const express = require("express");
const {
  getAllTools,
  createTool,
  getTool,
  updateTool,
  deleteTool,
} = require("../controllers/tool.controller");
const {
  createToolSchema,
  updateToolSchema,
} = require("../utils/validator/tool.validator");
const { validateData } = require("../utils/validator/validator");

const toolRouter = express.Router();

toolRouter
  .route("/")
  .get(getAllTools)
  .post(validateData(createToolSchema), createTool);

toolRouter
  .route("/:id")
  .get(getTool)
  .put(validateData(updateToolSchema), updateTool)
  .delete(deleteTool);

module.exports = toolRouter;

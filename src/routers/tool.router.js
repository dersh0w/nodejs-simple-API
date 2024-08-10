const express = require("express");
const toolController = require("../controllers/tool.controller");

const toolRouter = express.Router();

toolRouter
  .route("/")
  .get(toolController.getAllTools)
  .post(toolController.createTool);

toolRouter
  .route("/:id")
  .get(toolController.getTool)
  .put(toolController.updateTool)
  .delete(toolController.deleteTool);

module.exports = toolRouter;

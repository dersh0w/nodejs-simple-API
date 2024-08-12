const Tool = require("../models/Tool");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// TODO: Refatorar código
// TODO: Validar user input
// TODO: Adicionar filtros na função getAllTools
const findTool = async (userId, toolId) => {
  const tool = await User.find(
    { _id: userId },
    { userTools: { $elemMatch: { _id: toolId } } }
  );
  return tool[0].userTools[0];
};

exports.createTool = async (req, res, next) => {
  // Pega os dados da tool a ser criada
  const userId = req.user._id;
  const toolData = req.body;

  // Coloca a nova tool no array [userTools]
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { userTools: toolData } },
    { returnOriginal: false }
  );

  // Retorna a tool criada
  const toolIndex = user.userTools.length - 1;
  return res.status(201).json({
    status: "success",
    message: "Tool created successfully",
    data: {
      tool: user.userTools[toolIndex],
    },
  });
};

exports.getAllTools = catchAsync(async (req, res, next) => {
  // Retorna as tools do usuário pelo user salvo em [req.user]
  const tools = req.user.userTools;
  return res.status(200).json({
    status: "success",
    data: {
      tools,
    },
  });
});

exports.getTool = catchAsync(async (req, res, next) => {
  // Procura a tool pelo ID passado
  const userId = req.user._id;
  const toolId = req.params.id;
  let tool = await findTool(userId, toolId);

  if (!tool) {
    return next(new AppError("Tool Not Found", 400));
  }

  // Retorna a tool
  return res.status(200).json({
    status: "success",
    data: {
      tool,
    },
  });
});

exports.updateTool = catchAsync(async (req, res, next) => {
  // Procura a tool pelo ID passado
  const userId = req.user._id;
  const toolId = req.params.id;
  let tool = await findTool(userId, req.params.id);

  if (!tool) {
    return next(new AppError("Tool Not Found", 400));
  }

  // Dados a serem atualizados
  const toolUpdateData = {
    ...tool._doc,
    ...req.body,
    updatedAt: Date.now(),
  };

  // Atualiza a tool
  await User.findOneAndUpdate(
    { _id: userId, userTools: { $elemMatch: { _id: toolId } } },
    { $set: { "userTools.$": toolUpdateData } }
  );

  // Retorna a tool com os novos dados
  tool = await findTool(userId, toolId);
  return res.status(201).json({
    status: "success",
    message: "Tool updated successfully",
    data: {
      tool,
    },
  });
});

exports.deleteTool = catchAsync(async (req, res, next) => {
  // Procura a tool pelo ID passado
  const userId = req.user._id;
  const toolId = req.params.id;
  const tool = await findTool(userId, toolId);

  if (!tool) {
    return next(new AppError("Tool Not Found", 400));
  }

  // Deleta a tool
  await User.findByIdAndUpdate(userId, {
    $pull: { userTools: { _id: toolId } },
  });

  return res.status(203).json({
    status: "success",
    message: "Tool deleted successfully",
  });
});

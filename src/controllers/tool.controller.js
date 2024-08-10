const Tool = require("../models/Tool");
const User = require("../models/User");

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
  let user;
  try {
    user = await User.findByIdAndUpdate(
      userId,
      { $push: { userTools: toolData } },
      { returnOriginal: false }
    );
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

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

exports.getAllTools = async (req, res, next) => {
  // Procura o usuário pelo id salvo em [req.user]
  const userId = req.user._id;
  const user = await User.findById(userId);

  // Retorna as tools do usuário
  const tools = user.userTools;
  return res.status(200).json({
    status: "success",
    data: {
      tools,
    },
  });
};

exports.getTool = async (req, res, next) => {
  // Procura a tool pelo ID passado
  const userId = req.user._id;
  const toolId = req.params.id;
  let tool = await findTool(userId, toolId);

  if (!tool) {
    return res.status(400).json({
      status: "fail",
      message: "Tool not found",
    });
  }

  // Retorna a tool
  return res.status(200).json({
    status: "success",
    data: {
      tool,
    },
  });
};

exports.updateTool = async (req, res, next) => {
  // Procura a tool pelo ID passado
  const userId = req.user._id;
  const toolId = req.params.id;
  let tool = await findTool(userId, req.params.id);

  if (!tool) {
    return res.status(400).json({
      status: "fail",
      message: "Tool not found",
    });
  }

  // Dados a serem atualizados
  const toolUpdateData = {
    ...tool._doc,
    ...req.body,
    updatedAt: Date.now(),
  };

  // Atualiza a tool
  try {
    await User.findOneAndUpdate(
      { _id: userId, userTools: { $elemMatch: { _id: toolId } } },
      { $set: { "userTools.$": toolUpdateData } },
      { returnOriginal: false }
    );
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

  // Retorna a tool com os novos dados
  tool = await findTool(userId, toolId);
  return res.status(201).json({
    status: "success",
    message: "Tool updated successfully",
    data: {
      tool,
    },
  });
};

exports.deleteTool = async (req, res, next) => {
  // Procura a tool pelo ID passado
  const userId = req.user._id;
  const toolId = req.params.id;
  const tool = await findTool(userId, toolId);

  if (!tool) {
    return res.status(400).json({
      status: "fail",
      message: "Tool not found",
    });
  }

  // Deleta a tool
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { userTools: { _id: toolId } },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

  return res.status(203).json({
    status: "success",
    message: "Tool deleted successfully",
  });
};

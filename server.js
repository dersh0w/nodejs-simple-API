require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
const logger = require("./src/config/logger");

const port = process.env.APP_PORT ?? 3000;
app.listen(port, () => {
  logger.info(`Listening on :${port}`);
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed!");
  } catch (err) {
    logger.error(`Erro closing MongoDB connection: ${err}`);
  }
  process.exit(0);
});

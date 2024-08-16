require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./logger");

const { DB_PROT, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } =
  process.env;

let mongoUri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?authSource=admin`;

if (DB_PROT) {
  if (DB_PROT.includes("+"))
    mongoUri = `${DB_PROT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`;
}

module.exports = mongoose
  .connect(mongoUri)
  .then(() => {
    logger.info("Connected to MongoDB!");
  })
  .catch((err) => {
    logger.error("Error connecting to MongoDB!");
    logger.error(`${err.name}: ${err.message}`);
    process.exit(1);
  });

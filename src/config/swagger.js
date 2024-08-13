const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync(__dirname + "/openapi.yaml", "utf-8");
const swaggerDoc = YAML.parse(file);

module.exports = swaggerDoc;

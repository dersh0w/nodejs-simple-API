const path = require("path");
const YAML = require("yamljs");
const resolveRefs = require("json-refs").resolveRefs;
const logger = require("./logger");

const solveFile = async () => {
  const swaggerDefinitionJSON = YAML.load(
    path.resolve(__dirname, "../docs/openapi.yaml")
  );

  const options = {
    filter: ["relative", "remote"],
    loaderOptions: {
      processContent: function (res, callback) {
        callback(null, YAML.parse(res.text));
      },
    },
  };

  await resolveRefs(swaggerDefinitionJSON, options);
};
solveFile();

const multiFileSwagger = (root) => {
  const options = {
    filter: ["relative", "remote"],
    loaderOptions: {
      processContent: function (res, callback) {
        callback(null, YAML.parse(res.text));
      },
    },
  };

  return resolveRefs(root, options).then(
    function (results) {
      return results.resolved;
    },
    function (err) {
      logger.error(err.stack);
      process.exit(1);
    }
  );
};

const swaggerDoc = multiFileSwagger(
  YAML.load(path.resolve(__dirname, "../docs/openapi.yaml"))
);

module.exports = swaggerDoc;

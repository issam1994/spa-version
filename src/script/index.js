const fs = require("fs");
const { v4: uuid } = require("uuid");
const path = require("path");
const appRootPath = path.resolve("./");
const envFileReader = require("envfile");
const envFilePath = appRootPath + "/.env";
const envFile = fs.readFileSync(envFilePath);
const envFileData = envFileReader.parse(envFile);
const { version: versionFromPackageJson } = require(appRootPath +
  "/package.json");

const { REACT_APP_SPAVERSION_RANDOM } = envFileData;

function getVersion() {
  let version = versionFromPackageJson;
  if (REACT_APP_SPAVERSION_RANDOM) {
    version = `${version}+${uuid()}`;
  }
  return version;
}

function updateConfigFile(version) {
  const newEnvFileData = {
    ...envFileData,
    REACT_APP_SPAVERSION_VERSION: version,
  };
  fs.writeFileSync(
    envFilePath,
    envFileReader.stringify(newEnvFileData),
    "utf-8",
    function (err) {
      if (err) throw err;
    }
  );
}

function createMetaJson(version) {
  const content = `{
        "version": "${version}",
        "package": "spa-version"
    }`;

  fs.writeFileSync("public/meta.json", content, "utf-8", function (err) {
    if (err) throw err;
  });
}

function init() {
  console.log("@spa-version script is running");
  const version = getVersion();
  updateConfigFile(version);
  createMetaJson(version);
}

init();

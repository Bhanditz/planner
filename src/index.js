// Load environment variables
require('dotenv').config()

var config = require("./config.js");
var utils = require("./utils.js");
var csv = require("csvtojson");
var fs = require("fs");
var path = require('path');
var _ = require("lodash");

async function processCSV() {

  var PATH = path.resolve(config.SOURCE_PATH)

  return await csv({ delimiter: config.SEPARATOR })
    .fromFile(PATH);
}

async function init() {

  console.log(`~~~ Your planning will be ready soon...`)

  const tasks = await processCSV();
  const planning = utils.calculateSprints({tasks});

  utils.printPlanning({planning: planning});

  console.log(`~~~ Your planning is ready! Check ${config.SUCCESS_FILE_NAME}`)

}

init();

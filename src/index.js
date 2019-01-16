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
  console.log(PATH)
  return await csv({ delimiter: config.SEPARATOR })
    .fromFile(config.SOURCE_PATH);
}

async function init() {

  const tasks = await processCSV();

  console.log("=== PLANNING");
  const planning = utils.calculateSprints({tasks});
  const sprint2tasks = _.groupBy(planning, "sprint");
  console.log(sprint2tasks);

  utils.printPlanning({planning: sprint2tasks});

}

init();

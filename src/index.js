// Load environment variables
require('dotenv').config()
const path = require('path');

const config = require("./config.js");
const utils = require("./utils.js");

async function init() {

  console.log(`~~ Your planning will be ready soon...`)

  const PATH = path.resolve(config.SOURCE_PATH);

  let tasks = await utils.loadCSV(PATH);

  if (config.SPLIT_BIG_TASKS === "true"){
    console.log(`~~~ Splitting big tasks`)
    tasks = utils.splitBigTasks({tasks});
  }

  const planning = utils.calculateSprints({tasks});

  utils.printPlanning({planning, tasks});

  console.log(`~~ Hurray! Check ${config.PLANNING_FILE_NAME} out`)

}

init();

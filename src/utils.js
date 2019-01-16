var fs = require('fs');
var config = require("./config.js");
var rimraf = require("rimraf");
const _ = require('lodash');
const moment = require('moment');

function cleanOutputFolder() {

    rimraf.sync(config.OUTPUT_PATH);
    fs.mkdirSync(config.OUTPUT_PATH);
    fs.closeSync(fs.openSync(config.ERROR_FILE_NAME, 'w'));
    fs.closeSync(fs.openSync(config.SUCCESS_FILE_NAME, 'w'));
}

function appentToFile(file, content) {
    fs.appendFileSync(file, content);
}

function logSuccess(content) {
    fs.appendFileSync(config.SUCCESS_FILE_NAME, content + '\n');
}

function logError(content) {
    fs.appendFileSync(config.ERROR_FILE_NAME, content + '\n');
}

function log(l) {
    //console.log(l)
}

function getAvailableSprint({task, tasks, alreadyVisitedSprints}) {
  var sprint;
  for (var i = 1; i < config.MAX_SPRINT_AMOUNT; i++){
    var difficulty = getSprintDifficulty({sprint: i, tasks});
    var canAcceptsTask = difficulty < config.TEAM_VELOCITY;
    var isSprintVisited = arrayContains(alreadyVisitedSprints, i);
    if (!isSprintVisited && canAcceptsTask) {
      sprint = i;
      break;
    }
  }
  return sprint;
}

function getSprintDifficulty({sprint, tasks}){
  const reducer = (accumulator, currentValue) => {
    if (currentValue.sprint === sprint) {
      return accumulator + parseFloat(currentValue[config.DIFFICULTY_COLUMN_NAME]);
    }
    return accumulator;
  }

  return tasks.reduce(reducer, 0);
}

function arrayContains(array, item) {
  return !(array.indexOf(item) < 0);
}

function calculateSprint({task, tasks}) {

  var sprintFound = false;
  var alreadyVisitedSprints = [];

  while (!sprintFound) {

    // Get a candidate sprint
    var sprint = getAvailableSprint({task, tasks, alreadyVisitedSprints});

    // Return if candidate sprint is undefined
    if (!sprint) {
      sprintFound = true;
      return
    }

    var sprintDifficulty = getSprintDifficulty({sprint, tasks});
    var totDifficulty = sprintDifficulty + parseFloat(task[config.DIFFICULTY_COLUMN_NAME]);

    if (totDifficulty <= config.TEAM_VELOCITY) {
      task.sprint = sprint;
      sprintFound = true;
    } else {
      alreadyVisitedSprints.push(sprint);
    }
  };

  return task;
}

function calculateSprints({tasks}) {
  return tasks.map(task => {
      return calculateSprint({task, tasks})
  });
}

function formatData({date}) {return moment(date).format("LL");}

function printPlanning({planning}) {

    const sprint2tasks = _.groupBy(planning, "sprint");
    let sprintStart = moment(config.PROJECT_START_DAY, "DD/MM/YYYY");

    // Remove undefined key
    delete sprint2tasks["undefined"];

    console.log("=== PLANNING");
    console.log(sprint2tasks);

    cleanOutputFolder();

    // Print team velocity
    logSuccess(`Team velocity: ${config.TEAM_VELOCITY}`);
    logSuccess("");

    _.forEach(sprint2tasks, function(value, key) {

        const date = formatData({date: sprintStart});
        logSuccess(`- SPRINT #${key} starts on ${date}`);

        // Update sprintStart for next sprint
        sprintStart = sprintStart.add(config.SPRINT_DAYS_DURATION, 'days');

        _.forEach(value, function({
          [config.APP_NAME_COLUMN_NAME] :task,
          [config.DIFFICULTY_COLUMN_NAME] : difficulty}) {
            logSuccess(`${task} [${difficulty}]`);
        });

        logSuccess("");
    });

}

module.exports = {
    cleanOutputFolder,
    logSuccess,
    logError,
    printPlanning,
    calculateSprints
};

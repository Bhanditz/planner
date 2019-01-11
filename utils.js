var fs = require('fs');
var config = require("./config.js");
var rimraf = require("rimraf");
const _ = require('lodash');

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
      return accumulator + parseInt(currentValue.difficulty);
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
    var totDifficulty = sprintDifficulty + parseInt(task.difficulty);

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

function printPlanning({planning}) {
    cleanOutputFolder();

    // Print team velocity
    logSuccess(`Team velocity: ${config.TEAM_VELOCITY}`);
    logSuccess("");

    _.forEach(planning, function(value, key) {
        logSuccess(`- SPRINT: ${key}`);

        _.forEach(value, function({task, difficulty}) {
            logSuccess(`${task} [${difficulty}]`);
        });

        logSuccess("");
    });

}

module.exports = {
    cleanOutputFolder: cleanOutputFolder,
    logSuccess: logSuccess,
    logError: logError,
    printPlanning,
    calculateSprints
};

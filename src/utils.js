const fs = require('fs');
const rimraf = require("rimraf");
const _ = require('lodash');
const moment = require('moment');
const csv = require("csvtojson");
const config = require("./config.js");

const SPRINT = "sprint";

function cleanOutputFolder() {

    rimraf.sync(config.OUTPUT_PATH);
    fs.mkdirSync(config.OUTPUT_PATH);
    fs.closeSync(fs.openSync(config.ERROR_FILE_NAME, 'w'));
    fs.closeSync(fs.openSync(config.PLANNING_FILE_NAME, 'w'));
}

function appentToFile(file, content) {
    fs.appendFileSync(file, content);
}

function logSuccess(content) {
    fs.appendFileSync(config.PLANNING_FILE_NAME, content + '\n');
}

function logError(content) {
    fs.appendFileSync(config.ERROR_FILE_NAME, content + '\n');
}

function getAvailableSprint({task, tasks, alreadyVisitedSprints}) {
  let sprint;
  for (let i = 1; i < config.MAX_SPRINT_AMOUNT; i++){
    const difficulty = getSprintDifficulty({sprint: i, tasks});
    const canAcceptsTask = difficulty < config.TEAM_VELOCITY;
    const isSprintVisited = arrayContains(alreadyVisitedSprints, i);
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

  return tasks.reduce(reducer, parseFloat(config.FREE_TIME_PER_SPRINT));
}

function arrayContains(array, item) {
  return !(array.indexOf(item) < 0);
}

function isSprintSuitable({sprint, tasks, task}) {
  const sprintDifficulty = getSprintDifficulty({sprint, tasks});
  const totDifficulty = sprintDifficulty + parseFloat(task[config.DIFFICULTY_COLUMN_NAME]);

  //  const isSplit = task.split;
  //if (isSplit) {
    //const sprint2tasks = _.groupBy(planning, SPRINT);
    //console.log("Is split", task)
  //}

  return totDifficulty <= config.TEAM_VELOCITY;
}

function calculateSprint({task, tasks}) {

  let sprintFound = false;
  let alreadyVisitedSprints = [];

  while (!sprintFound) {

    // Get a candidate sprint
    const sprint = getAvailableSprint({task, tasks, alreadyVisitedSprints});

    // Return if candidate sprint is undefined
    if (!sprint) {
      sprintFound = true;
      return
    }

    if (isSprintSuitable({task, sprint, tasks})) {
      task.sprint = sprint;
      sprintFound = true;
    } else {
      alreadyVisitedSprints.push(sprint);
    }
  };

  return task;
}

function calculateSprints({tasks}) {

  return tasks
    .map(task => { return calculateSprint({task, tasks}) })
    .filter(t => !!t);
}

function getUnplannedTasks({tasks}) {
  return tasks.filter(function(p) {
      return parseFloat(p[config.DIFFICULTY_COLUMN_NAME]) > config.TEAM_VELOCITY;
  })

}

function printTask ({[config.APP_NAME_COLUMN_NAME]: task, [config.DIFFICULTY_COLUMN_NAME]: difficulty}) {
    logSuccess(`${task} [difficulty ${difficulty}]`);
}

function formatData({date}) {return moment(date).format("LL");}

function printPlanning({planning, tasks}) {

    const sprint2tasks = _.groupBy(planning, SPRINT);
    let sprintStart = moment(config.PROJECT_START_DAY, "DD/MM/YYYY");
    let sprintEnd;
    const thereAreUnplannedTasks = planning.length !== tasks.length;

    // Remove undefined key
    delete sprint2tasks["undefined"];

    cleanOutputFolder();

    // Print team velocity
    logSuccess(`Team velocity: ${config.TEAM_VELOCITY}`);
    if (parseFloat(config.FREE_TIME_PER_SPRINT) > 0){
      logSuccess(`Voluntary free time per sprint: ${config.FREE_TIME_PER_SPRINT}`);
    }
    logSuccess("");

    // Print warning if there are unplanned tasks
    if (thereAreUnplannedTasks) {
      logSuccess(`WARNING!`);
      logSuccess(`The following tasks could not be planned. [Task difficulty > (Team velocity - Free time per sprint)]`);
      const unplanned = getUnplannedTasks({tasks});
      unplanned.forEach(printTask);
      logSuccess(`WARNING!`);
      logSuccess("");
    }

    _.forEach(sprint2tasks, function(value, key) {

        sprintEnd = sprintStart.clone().add(config.SPRINT_DAYS_DURATION, 'days');

        const start = formatData({date: sprintStart});
        const end = formatData({date: sprintEnd});
        logSuccess(`- SPRINT #${key} <${start} -> ${end}>`);

        // Update sprintStart for next sprint
        sprintStart = sprintEnd;

        _.forEach(value, printTask);

        logSuccess("");
    });
}

function splitBigTasks({tasks}){

  const normalizedTasks = [];
  const teamVelocity = parseFloat(config.TEAM_VELOCITY);

  tasks.forEach((t, i) => {

    const id = i + 1;
    // Clone task, parse difficulty and add task id
    let normalized = {
      ...t,
      [config.DIFFICULTY_COLUMN_NAME] : parseFloat(t[config.DIFFICULTY_COLUMN_NAME]),
      id
    };
    const {
      [config.DIFFICULTY_COLUMN_NAME] : difficulty,
      [config.APP_NAME_COLUMN_NAME] : AppName
    } = normalized;

    // Split big task in subtasks
    if (difficulty > teamVelocity){
      const subTasksAmount = Math.ceil(difficulty / teamVelocity);

      _.times(subTasksAmount, i => {

        const id = `${normalized.id}-${i + 1}`;
        const parentId = `${normalized.id}`
        const isLastSubtask = i === subTasksAmount - 1;

        const subtask = {
          ...normalized,
          id,
          [config.APP_NAME_COLUMN_NAME]: `${AppName} [split]`,
          [config.DIFFICULTY_COLUMN_NAME]: (isLastSubtask ? difficulty % teamVelocity : teamVelocity),
          split: true,
          parentId,
        };

        normalizedTasks.push(subtask);

      });

    } else {
      normalizedTasks.push(normalized);
    }

  });

  return normalizedTasks;
}

async function loadCSV( path ) {

  return await csv({ delimiter: config.SEPARATOR }).fromFile(path);
}

module.exports = {
    loadCSV,
    splitBigTasks,
    cleanOutputFolder,
    logSuccess,
    logError,
    printPlanning,
    calculateSprints
};

const {
  SOURCE_PATH = "./source/tasks.csv",
  OUTPUT_PATH = "./output/",
  ERROR_FILE_NAME = "./output/error.txt",
  SUCCESS_FILE_NAME = "./output/success.txt",
  TEAM_VELOCITY = "4",
  MAX_SPRINT_AMOUNT = "50",
  SEPARATOR= ","
} = process.env;

module.exports = {
  SOURCE_PATH,
  OUTPUT_PATH,
  ERROR_FILE_NAME,
  SUCCESS_FILE_NAME,
  TEAM_VELOCITY,
  MAX_SPRINT_AMOUNT,
  SEPARATOR
};

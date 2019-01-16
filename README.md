# Planner

## Getting started

- create a new file called `.env` from `.env.example` and alter the needed params
- [ folders name may vary according the `.env` parameter you define, the following instruction are based on the default parameters]
- create `./output/` folder
- create the `./output/tasks.csv` file that contains your list of tasks
- run `npm start` to get you plan!

### Environment parameters

|  Variable name  	|  Description 	|  Default value	|
|:-:	|---	|---	|
|   `SOURCE_PATH`	|   Path to the CSV file 	|   `./source/tasks.csv`	|
|   `OUTPUT_PATH`	|   Path to the folder in which output files will be written	|   `./output/`	|
|   `ERROR_FILE_NAME`	|   Error file	|   `./output/error.txt`	|
|   `SUCCESS_FILE_NAME`	|  Log file for success operations 	|   `./output/success.txt`	|
|   `TEAM_VELOCITY`	|  The development team velocity	|   `4`	|
|   `MAX_SPRINT_AMOUNT`	|  The max number of sprint to plan 	|   `50`	|
|   `SEPARATOR`	|   CSV separator	|   `,`	|
|   `DIFFICULTY_COLUMN_NAME`	|   Name of the difficulty column in the CSV	|   `difficulty`	|
|   `PROJECT_START_DAY`	|   Start day of the first sprint. Format is DD/MM/YYYY	|   `31/01/2019`	|
|   `SPRINT_DAYS_DURATION`	|   Duration of the sprint in days	|   `14`	|

### CSV example
```
task,difficulty
Task 1,10
Task 2,1
Task 3,1
Task 4,2
Task 5,2
Task 6,1
Task 7,1
Task 8,3
Task 9,2
Task 10,1
Task 11,2
```

### Output example

```
Team velocity: 4

WARNING!
The following tasks could not be planned. (Task difficulty > Team velocity)
Task 1 [difficulty 10]
WARNING!

- SPRINT #1 starts on January 31, 2019
Task 2 [difficulty 1]
Task 3 [difficulty 1]
Task 4 [difficulty 2]

- SPRINT #2 starts on February 14, 2019
Task 5 [difficulty 2]
Task 6 [difficulty 1]
Task 7 [difficulty 1]

- SPRINT #3 starts on February 28, 2019
Task 8 [difficulty 3]
Task 10 [difficulty 1]

- SPRINT #4 starts on March 14, 2019
Task 9 [difficulty 2]
Task 11 [difficulty 2]

```

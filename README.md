# Planner

## Getting started

- create a new file called `.env` from `.env.example` and alter the needed params
- [ folders name may vary according the `.env` parameter you define, the following instruction are based on the default parameters]
- create `./output/` folder
- create the `./output/tasks.csv` file that contains your list of tasks
- run `npm start` to get you plan!

### Considerations on the CSV
- The tasks contained within the CSV have to be sorted by priority
- Most important tasks have to be placed as first rows of the CSV
- The algorithm will assign tasks according to the CSV order

### Environment parameters

|  Variable name  	|  Description 	|  Default value	|
|:-:	|---	|---	|
|   `SOURCE_PATH`	|   Path to the CSV file 	|   `./source/tasks.csv`	|
|   `OUTPUT_PATH`	|   Path to the folder in which output files will be written	|   `./output/`	|
|   `ERROR_FILE_NAME`	|   Error file	|   `./output/error.txt`	|
|   `PLANNING_FILE_NAME`	|  Path of the planning 	|   `./output/planning.txt`	|
|   `TEAM_VELOCITY`	|  The development team velocity	|   `4`	|
|   `MAX_SPRINT_AMOUNT`	|  The max number of sprint to plan 	|   `50`	|
|   `SEPARATOR`	|   CSV separator	|   `,`	|
|   `DIFFICULTY_COLUMN_NAME`	|   Name of the difficulty column in the CSV	|   `difficulty`	|
|   `PROJECT_START_DAY`	|   Start day of the first sprint. Format is DD/MM/YYYY	|   `31/01/2019`	|
|   `SPRINT_DAYS_DURATION`	|   Duration of the sprint in days	|   `14`	|
|   `FREE_TIME_PER_SPRINT`	|   Voluntary unallocated time per sprint. Useful when you want to reserver time in the sprint to study, refactor, review, etc.	|   `0`	|
|   `SPLIT_BIG_TASKS`	|   Whether or not tasks with a difficulty bigger than the team velocity should be split in subtasks 	|   `true`	|

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

### Planning example

```
Team velocity: 4
Voluntary free time per sprint: 1

WARNING! (Only visible if SPLIT_BIG_TASKS = false)
The following tasks could not be planned. [Task difficulty > (Team velocity - Free time per sprint)]
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

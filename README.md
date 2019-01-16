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


### CSV example
```
task,difficulty
Task 1,3
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

- SPRINT: 1
Task 1 [3]
Task 2 [1]

- SPRINT: 2
Task 3 [1]
Task 4 [2]
Task 6 [1]

- SPRINT: 3
Task 5 [2]
Task 7 [1]
Task 10 [1]

- SPRINT: 4
Task 8 [3]

- SPRINT: 5
Task 9 [2]
Task 11 [2]

```

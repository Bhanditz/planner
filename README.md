# Planner

## Getting started

- create `./output/` folder
- create the `./output/tasks.csv` file that contains your list of tasks
- [optionally edit your team velocity within `./config.js`]
- run `npm start` to get you plan!

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

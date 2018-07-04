const solve = require('./app/nonogram');
let {status, puzzle} = solve('./puzzles/test.json');
const utils = require('./app/utils');

console.log(puzzle);
console.log(puzzle.solveSteps);
console.log(JSON.stringify(puzzle.solveSteps));
utils.saveSteps('./puzzles/test.steps.json', puzzle)
console.log(utils.loadSteps('./puzzles/test.steps.json'));
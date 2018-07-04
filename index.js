//require('./app');

const solve = require('./app/nonogram');
let {status, puzzle} = solve('./puzzles/test.json');

console.log(puzzle);
console.log(puzzle.solveSteps);
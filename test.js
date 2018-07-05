const solve = require('./app/nonogram');
let {status, puzzle} = solve(`./puzzles/train1.json`, );
console.log(puzzle);
//console.log(puzzle.solveSteps);
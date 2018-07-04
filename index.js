//require('./app');

const solve = require('./app/nonogram');
let {status, puzzle} = solve('./puzzles/start.json');

console.log(puzzle);
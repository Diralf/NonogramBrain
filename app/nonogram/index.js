const fs = require('fs');

const allSolvers = require('../../node_modules/nonogram-solver/src/allSolvers');
//const Puzzle = require('../../node_modules/nonogram-solver/src/Puzzle');
//let Strategy = require('../../node_modules/nonogram-solver/src/Strategy');
const Puzzle = require('./StepPuzzle');
let Strategy = require('./StepStrategy');

if (require.main === module) {
  console.error('Do not run index.js. Try running cli.js instead');
  process.exit(1);
}

module.exports = inputFilename => {
  let puzzleData = fs.readFileSync(inputFilename, 'utf-8');
  let puzzle = new Puzzle(puzzleData);
  let strategy = new Strategy(allSolvers);
  strategy.solve(puzzle);
  let status = 0;
  if (puzzle.isFinished) {
    status = puzzle.isSolved ? 1 : -1;
  }
  return {status, puzzle};
};
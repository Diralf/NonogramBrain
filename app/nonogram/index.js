const fs = require("fs");
const allSolvers = require("../../node_modules/nonogram-solver/src/allSolvers");
const Puzzle = require("./StepPuzzle");
const Strategy = require("./StepStrategy");

//const Puzzle = require('../../node_modules/nonogram-solver/src/Puzzle');
//let Strategy = require('../../node_modules/nonogram-solver/src/Strategy');

if (require.main === module) {
  console.error('Do not run index.js. Try running cli.js instead');
  process.exit(1);
}

module.exports = (inputFilename, solvers = allSolvers) => {
  let puzzleData = fs.readFileSync(inputFilename, 'utf-8');
  let puzzle = new Puzzle(puzzleData);
  let strategy = new Strategy(solvers);
  strategy.solve(puzzle);
  let status = 0;
  if (puzzle.isFinished) {
    status = puzzle.isSolved ? 1 : -1;
  }
  return {status, puzzle};
};
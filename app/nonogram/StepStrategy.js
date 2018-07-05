const Strategy = require('./Strategy');

const assert = require("assert");

const util = require("../../node_modules/nonogram-solver/src/util");
const Puzzle = require('./Puzzle');
const Step = require('./Step');

const debugMode = true;//require('commander').debug;
const { recursionDepth: maxRecursionLevel } = require('commander');

module.exports = class StepStrategy extends Strategy {
    
    /**
   * @private
   * Run one solver on the puzzle
   * @param {Puzzle} puzzle The puzzle to solve
   * @param {Solver} solver The solver to use
   * @param {number} solverIndex The solver's index in `this.solvers`
   * @param {Array} solutionSequence Array of strings for statistics in debug mode
   */
  solveOnce(puzzle, solver, solverIndex, solutionSequence) {
    // If we're dealing with a slow solver, we want to skip as soon as one line is partially solved
    let skipEarly = solver.speed === 'slow';
    let skip = false;

    // Optimize iteration order
    let optimizeOrder = (lines, hints) => {
      // remove already solved lines
      let unsolvedLines = lines.reduce((result, line, index) => {
        let zeros = line.reduce((count, x) => count + (x === 0 ? 1 : 0), 0);
        if (!zeros) {
          return result;
        }
        result.push({line, index, zeros});
        return result;
      }, []);

      // sort by estimated computation effort
      if (skipEarly) {
        unsolvedLines.forEach(lineMeta => {
          let {index, zeros} = lineMeta;
          let hintSum = util.hintSum(hints[index]);
          let estimate = zeros < hintSum ? 0 : Math.pow(zeros - hintSum, hints[index].length);
          lineMeta.estimate = estimate;
        });
        unsolvedLines.sort(({estimate: left}, {estimate: right}) => left - right);
      }
      return unsolvedLines;
    };

    // the actual execution
    let run = (lines, hints, onRow) => {
      let visited = onRow ?
        {current: this.visited.rows, other: this.visited.columns} :
        {current: this.visited.columns, other: this.visited.rows};
      let rearrangedLines = optimizeOrder(lines, hints);
      rearrangedLines.forEach(({line, index: i, estimate}) => {
        let step = new Step(hints[i].slice(), line.map(value => value));

        if (skip || visited.current[i][solverIndex]) {
          return;
        }
        if (debugMode) {
          console.log(`Running solver ${solverIndex} on ${onRow ? 'row' : 'column'} ${i}`, JSON.stringify(line.slice()), hints[i]);
          if (estimate) {
            console.log(`Estimated effort: ${estimate}`);
          }
        }
        visited.current[i][solverIndex] = 1;
        // First, trim unnecessary information from the line
        
        if (debugMode) {
          var start = Date.now();
        }
        let newLine, trimInfo;
        // solver run
        if (solver.net) {
          newLine = solver(line.map(val => val), hints[i]);
        } else {
          let [trimmedLine, trimmedHints, trimInfoSc] = util.trimLine(line, hints[i]);
          trimInfo = trimInfoSc;
          newLine = solver(trimmedLine, trimmedHints);
        }
        

        if (debugMode) {
          let end = Date.now();
          if (end - start > 100) {
            console.log(`Long run: ${end - start}ms`);
          }
        }

        // now, restore the trimmed line and analyze the result
        let hasChanged = false;
        let changedLines = [];
        if (newLine) { // the solver may return null to indicate no progress
          if (!solver.net) {
            newLine = util.restoreLine(newLine, trimInfo);
          } 

          
          line.forEach((el, i) => {
            // What has changed?
            if (el !== newLine[i]) {
              line[i] = newLine[i];
              // These perpendicular lines must be revisited
              visited.other[i].fill(0);
              if (debugMode) {
                changedLines.push(i);
              }
            }
          });
          hasChanged = changedLines.length > 0;
          skip = hasChanged && skipEarly;
        }

        step.solution = newLine.slice();
        puzzle.solveSteps.push(step);
        //console.log(step);

        if (!debugMode) {
          util.spinner.spin();
        } else if (hasChanged) {
          console.log(`found ${newLine}`);
          console.log(puzzle);
          console.log(`Must revisit ${onRow ? 'column' : 'row'}${changedLines.length > 1 ? 's' : ''} ${changedLines.join(',')}`);
          solutionSequence.push(`(${solverIndex})${onRow ? 'r' : 'c'}${i}[${changedLines.join(',')}]`);
        }
      });
    };

    // run on rows
    run(puzzle.rows, puzzle.rowHints, true);
    if (skip) {
      return;
    }
    // …and then on columns
    run(puzzle.columns, puzzle.columnHints);
  }

}
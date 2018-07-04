const Puzzle = require('./Puzzle');

module.exports = class StepPuzzle extends Puzzle {
    constructor(data) {
        super(data);

        this.solveSteps = [];
    }
}
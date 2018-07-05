const solve = require('./app/nonogram');
const utils = require('./app/utils');


exports.fetchSteps = puzzleNames => {
    return puzzleNames.map(preparePuzzle);
}

exports.getSteps = puzzleNames => {
    //utils.loadSteps('./puzzles/train1.steps.json')
    return puzzleNames.map(name => utils.loadSteps(`./puzzles/${name}.steps.json`))
}

exports.getCommonSteps = puzzleNames => {
    return exports.getSteps(puzzleNames).reduce((comm, steps) => comm.concat(steps));
}

function preparePuzzle(puzzleName) {
    let {status, puzzle} = solve(`./puzzles/${puzzleName}.json`);

    //console.log(puzzle);
    //console.log(puzzle.solveSteps);
    //console.log(JSON.stringify(puzzle.solveSteps));
    utils.saveSteps(`./puzzles/${puzzleName}.steps.json`, puzzle.solveSteps);

    return puzzle;
}
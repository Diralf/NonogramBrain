const fs = require('fs');

exports.saveSteps = (fileName, puzzle) => {
    fs.writeFileSync(fileName, JSON.stringify(puzzle.solveSteps));
}

exports.loadSteps = (fileName) => {
    let data = fs.readFileSync(fileName);
    return JSON.parse(data);
}
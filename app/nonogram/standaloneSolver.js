
const allSolvers = require("../../node_modules/nonogram-solver/src/allSolvers");

module.exports = (line, hints) => {
    let solution = allSolvers[0](line, hints);
    //console.log(line, hints, " -> ", solution);
    return solution
};
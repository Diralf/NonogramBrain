const prepare = require('./prepare');
const BrainSolution = require('./app/brain');
const BrainSolutionTimeStep = require('./app/brain/NonogramLSTM');
const train = require('./train');

let brain;
let steps;

exports.start = function (isLoad, isMakeSteps, trainFiles) {
    brain = new BrainSolution('brain-FFW-small', false);
    exports.brain = brain;
    if (isMakeSteps) prepare.fetchSteps(trainFiles);
    steps = prepare.getCommonSteps(trainFiles);

    if (isLoad) {
        brain.load()
    }
}

exports.trainNet = function (callback) {
    return train(steps, brain, callback);
}

exports.test = function () {
    console.log([0,0,0,0,0,0,0,0,0,0], [7], ' -> ', brain.solve([0,0,0,0,0,0,0,0,0,0], [7]));
    console.log([-1,0,-1,0,0,0,-1,0,0,-1], [3], ' -> ', brain.solve([-1,0,-1,0,0,0,-1,0,0,-1], [3]));

    console.log([-1,0,0,-1,-1,0,-1,0,0,-1], [2, 2], ' -> ', brain.solve([-1,0,0,-1,-1,0,-1,0,0,-1], [2, 2]));
}

// for (let step of steps) {
//      brain.solve(step.line, step.hint);
// }
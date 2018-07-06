const prepare = require('./prepare');
const BrainSolution = require('./app/brain');
const BrainSolutionTimeStep = require('./app/brain/NonogramLSTM');
const train = require('./train');

//let brain = new BrainSolution('brain-FFW', false, null);
let brain = new BrainSolutionTimeStep('brain-TIMESTEP');
//let brain = new BrainSolution('brain-RNN', true, null);
let files = ['nonograms.org/Helicopter'/*,'manual10-0', 'manual10-50','manual10-150','manual10-250','manual10-1000'*/];
let isTrain = true;

//prepare.fetchSteps(files);
let steps = prepare.getCommonSteps(files);

if (isTrain) {
    train(steps, brain);  
} else {
    brain.load()
}

console.log([0,0,0,0,0,0,0,0,0,0], [7], ' -> ', brain.solve([0,0,0,0,0,0,0,0,0,0], [7]));
console.log([-1,0,-1,0,0,0,-1,0,0,-1], [3], ' -> ', brain.solve([-1,0,-1,0,0,0,-1,0,0,-1], [3]));

console.log([-1,0,0,-1,-1,0,-1,0,0,-1], [2, 2], ' -> ', brain.solve([-1,0,0,-1,-1,0,-1,0,0,-1], [2, 2]));

//return 0;

const solve = require('./app/nonogram');
let solver = (line, hints) => brain.solve(line, hints);
let testFile = `./puzzles/nonograms.org/Helicopter.json`;
solver.net = true;

let {status, puzzle} = solve(testFile, [solver]);
console.log('Result of Network', puzzle);
return 0;
let {statusR, puzzleR} = solve(testFile);
console.log('Result of Solver', statusR);


// for (let step of steps) {
//      brain.solve(step.line, step.hint);
// }
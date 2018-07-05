const prepare = require('./prepare');
const BrainSolution = require('./app/brain');
const train = require('./train');

let brain = new BrainSolution('brain1');
let files = ['train1'];
let isTrain = true;

//prepare.fetchSteps(files);
let steps = prepare.getCommonSteps(files);

if (isTrain) {
    train(steps, brain);  
} else {
    brain.load()
}
//
console.log([0,0,0,0,0,0,0,0,0,0,0,0], [9], ' -> ', brain.solve([0,0,0,0,0,0,0,0,0,0,0,0], [9]));

const solve = require('./app/nonogram');
let solver = (line, hints) => brain.solve(line, hints);
solver.net = true;
let {status, puzzle} = solve(`./puzzles/train1.json`, [solver]);
console.log(puzzle);


// for (let step of steps) {
//      brain.solve(step.line, step.hint);
// }
let solver = require('./app/nonogram/standaloneSolver');
let Step = require('./app/nonogram/Step');
let utils = require('./app/utils');

function getHint(hints, prevHint, length, nHint) {
    let hint1 = Math.floor(prevHint / length) - 1;
    if (hint1 >= 0) {
        if (!hints[nHint] && hints[nHint] !== 0) {
            hints.push(0);
        }
        hints[nHint] = (hint1 % length) + 1;
        getHint(hints, hint1, length, nHint + 1);
    }
}

function getPoint(line, prevPoint, length, nPoint) {
    if (nPoint >= length) return;
    let point1 = Math.floor(prevPoint / 3);
    line[nPoint] = (point1 % 3) - 1;
    getPoint(line, point1,length, nPoint+1);
}

function checkHints(hints, length) {
    let sum = 0;
    for (let hint of hints) {
        sum += hint;
    }
    sum += hints.length - 1;

    return sum <= length;
}



for (let l = 1; l < 20; l++) {
    let steps = [];
    let length = l;
    let hints = [];
    for (let i = 0; i < Math.pow(length, (length /2) + 1); i++) {
        hints[0] = (i % length) + 1;

        getHint(hints, i, length, 1);

        if (!checkHints(hints, length)) continue;

        for (let k = 0; k < Math.pow(3, length); k++) {
            let solution = [];
            let line = new Array(length).fill(-1);

            line[0] = (k % 3) - 1;

            getPoint(line, k, length, 1);

            solution = solver(line, hints);

            if (solution !== null) {
                steps.push(new Step(line, hints, solution));
            }
        }
        console.log(l, hints);
    }

    utils.saveSteps(`./puzzles/manual${l}.steps.json`,steps);
}


//console.log(steps);

solver([0,-1,0,-1,0], [3]);
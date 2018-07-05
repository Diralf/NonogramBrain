const brain = require('brain.js');
const utils = require('../utils');
const NonogramLSTM = require('./NonogramLSTM');

module.exports = class BrainSolution {
    constructor(name) {
        this.name = name;

        this.net = new brain.recurrent.LSTM({
          inputSize: 20,
          hiddenSizes:[20, 20],
          outputSize: 12,
          learningRate: 0.01,
          decayRate: 0.9,
          smoothEps: 1e-8,
          regc: 0.000001,
          clipval: 5
        });
    }

    train(steps) {
        let trainData = steps.map(step => {
            let input = BrainSolution.convertToInput(step.line, step.hint);
            let output = step.solution;
            return {input, output};
        });
        console.log(trainData)
        this.net.train(trainData, {
          iterations: 20000,
          errorThresh: 0.005,
          log: true
        });
    }

    solve(line, hints) {
        let solution;
        let input = BrainSolution.convertToInput(line, hints);
        //this.net.dataFormatter = null;
        //console.log("-----------------------------");
        //console.log(line, hints);
        solution = this.net.run(input);//.split('');
        //console.log("raw", solution);
        solution = solution.filter(val => typeof val !== 'string');
        //console.log("filter", solution);
        solution = solution.slice(0, line.length).map(val => {
            if (val < -1 + 0.1) return -1;
            if (val > 1 - 0.1) return 1;
            return 0;
        });
        
        let solutionLength = solution.length;
        for (let i = solutionLength; i < line.length; i++) {
            solution.push(0);
        }

        solution = solution.map((val, i) => line[i] === 0 ? val : line[i]);
        //console.log("rounded", solution);

        return solution;
    }

    save(name = this.name) {
        utils.saveNet(name, this.net);
    }

    load(name = this.name) {
        let json = utils.loadNet(name);
        this.net.fromJSON(json);
    }

    static convertToInput(line, hints) {
        let normalHints = BrainSolution.normalizeHints(hints, line.length);
        return line.concat(normalHints);
    }

    // {input: [2, 2], output: [1, 1, 0, 1, 1]}
    // {input: [0.4, 0.4], output: [1, 1, 0, 1, 1]}
    static normalizeHints(hints, lineSize) { 
        return hints.map(hint => hint / lineSize);
    }
}

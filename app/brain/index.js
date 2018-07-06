const brain = require('brain.js');
const utils = require('../utils');
//const NonogramLSTM = require('./NonogramLSTM');

module.exports = class BrainSolution {
    constructor(name, isRNN, statisticCallback) {
        this.name = name;


        if (isRNN) {
            this.net = new brain.recurrent.LSTM({
                inputSize: 15,
                hiddenSizes: [15, 15],
                outputSize: 10,
                learningRate: 0.01,
                decayRate: 0.9,
                smoothEps: 1e-8,
                regc: 0.000001,
                clipval: 5
            });

            this.trainOptions = {
                iterations: 1000,
                errorThresh: 0.005,
                log: true,
                logPeriod: 1,
                callback: () => {this.save()},       // a periodic call back that can be triggered while training
                callbackPeriod: 1,
            };
        } else {
            this.net = new brain.NeuralNetwork({
                binaryThresh: 0.5,     // ¯\_(ツ)_/¯
                hiddenLayers: [15],     // array of ints for the sizes of the hidden layers in the network
                activation: 'tanh'  // Supported activation types ['sigmoid', 'relu', 'leaky-relu', 'tanh']
            });

            this.trainOptions = {
                iterations: 1,    // the maximum times to iterate the training data
                errorThresh: 0.005,   // the acceptable error percentage from training data
                log: true,           // true to use console.log, when a function is supplied it is used
                logPeriod: 1,        // iterations between logging out
                learningRate: 0.5,    // multiply's against the input and the delta then adds to momentum
                momentum: 0.1,        // multiply's against the specified "change" then adds to learning rate for change
                callback: () => {this.save()},       // a periodic call back that can be triggered while training
                callbackPeriod: 1000,   // the number of iterations through the training data between callback calls
                timeout: Infinity     // the max number of milliseconds to train for
            };
        }
    }

    train(steps) {
        let trainData = steps.map(step => {
            let input = this.convertToInput(step.line, step.hint);
            let output = step.solution;
            return {input, output};
        });
        console.log(trainData);
        this.net.train(trainData, this.trainOptions);
    }

    solve(line, hints) {
        let solution;
        let input = this.convertToInput(line, hints);
        //this.net.dataFormatter = null;
        //console.log("-----------------------------");
        //console.log(line, hints);
        solution = this.net.run(input);//.split('');
        console.log("raw", solution);
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

    convertToInput(line, hints) {
        let normalHints = BrainSolution.normalizeHints(hints, line.length);
        return line.concat(normalHints);
    }

    // {input: [2, 2], output: [1, 1, 0, 1, 1]}
    // {input: [0.4, 0.4], output: [1, 1, 0, 1, 1]}
    static normalizeHints(hints, lineSize) { 
        return hints.map(hint => hint / lineSize);
    }
}

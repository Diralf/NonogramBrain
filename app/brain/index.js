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
                hiddenLayers: [40,50, 40],     // array of ints for the sizes of the hidden layers in the network
                activation: 'tanh'  // Supported activation types ['sigmoid', 'relu', 'leaky-relu', 'tanh']
            });

            this.trainOptions = {
                iterations: 10,    // the maximum times to iterate the training data
                errorThresh: 0.005,   // the acceptable error percentage from training data
                log: true,           // true to use console.log, when a function is supplied it is used
                logPeriod: 10,        // iterations between logging out
                learningRate: 0.00005,    // multiply's against the input and the delta then adds to momentum
                momentum: 0.1,        // multiply's against the specified "change" then adds to learning rate for change
                callback: () => {this.save()},       // a periodic call back that can be triggered while training
                callbackPeriod: 100,   // the number of iterations through the training data between callback calls
                timeout: Infinity     // the max number of milliseconds to train for
            };
        }
    }

    train(steps, statisticCallback) {
        let trainData = steps.map(step => {
            let input = this.convertToInput(step.line, step.hint);
            let output = this.convertToOutput(step.solution);
            console.log(step.solution, output, BrainSolution.unnormalizeLine(output, step.solution.length))
            return {input, output};
        });
        if (statisticCallback) this.trainOptions.callback = statisticCallback;
        return this.net.train(trainData, this.trainOptions);
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
        console.log("filter", solution);
        solution = solution.slice(0, line.length)

        //solution = BrainSolution.unnormalizeLine(solution, line.length);
        console.log("unnormalizeLine", solution);
        solution = solution.map(val => {
            if (val < -1 + 0.5) return -1;
            if (val > 1 - 0.5) return 1;
            return 0;
        });
        
        let solutionLength = solution.length;
        for (let i = solutionLength; i < line.length; i++) {
            solution.push(0);
        }

        solution = solution.map((val, i) => line[i] === 0 ? val : line[i]);
        console.log("rounded", solution);

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
        //let normalHints = BrainSolution.normalizeHints(hints, line.length);
        let normalLine = BrainSolution.normalizeLine(line);
        let normalHints = BrainSolution.normalizeHints(hints, line.length);
        // let normalHintsLength = normalHints.length;
        // for (let i = normalHintsLength; i < line.length; i++) {
        //     normalHints.push(0);
        // }
        BrainSolution.alignLength(normalLine, line.length);
        BrainSolution.alignLength(normalHints, line.length);

        return normalLine.concat(normalHints);
    }

    convertToOutput(solution) {
        let normalSolution = BrainSolution.normalizeLine(solution);
        BrainSolution.alignLength(normalSolution, solution.length);
        return normalSolution;
    }

    // {input: [2, 2], output: [1, 1, 0, 1, 1]}
    // {input: [0.4, 0.4], output: [1, 1, 0, 1, 1]}
    static normalizeHints(hints, lineSize) { 
        return hints.map(hint => hint / lineSize);
    }

    static normalizeLine(line) {
        let result = [];
        let count = 1;
        for (let i = 0; i < line.length; i++) {
            if ((i+1) < line.length && line[i] === line[i+1]) {
                count++;
            } else {
                result.push((((count / line.length) + line[i] + 1) * 2 / 3) - 1);
                count = 1;
            }
        }
        return result;
    }

    static unnormalizeLine(normalLine, size) {
        let line = [];
        for (let part of normalLine) {
            if (part === 0) break;
            let value, count;
            let a = (((part + 1) * 3 / 2) - 0.0000000001);
            value = (~~a) - 1;
            count = (a % 1) * size;
            console.log(`unnn: normalLine ${normalLine}, size ${size}, a ${a}, value ${value}, count ${count},  ${Math.round(count)}`);
            count = Math.round(count);
            for (let i = 0; i < count; i++) {
                line.push(value);
            }
        }
        return line;
    }

    static alignLength(line, size) {
        let lineLength = line.length;
        for (let i = lineLength; i < size; i++) {
            line.push(0);
        }
    }
}

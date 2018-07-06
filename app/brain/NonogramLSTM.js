const brain = require('brain.js');
const BrainSolution = require('../brain');

module.exports = class BrainSolutionTimeStep extends BrainSolution {
    constructor(name, isRNN, statisticCallback){
        super(name, isRNN, statisticCallback);
        this.net = new brain.recurrent.LSTMTimeStep({
            inputSize: 20,
            hiddenSizes: [20, 20, 20],
            outputSize: 20,
            learningRate: 0.001,
            decayRate: 0.999,
            smoothEps: 1e-8,
            regc: 0.000001,

        });

        this.trainOptions = {
            iterations: 10000,
            errorThresh: 0.005,
            log: true,
            logPeriod: 10,
            callback: () => {this.save()},       // a periodic call back that can be triggered while training
            callbackPeriod: 100,
            learningRate: 0.5,    // multiply's against the input and the delta then adds to momentum
            momentum: 0.1        // multiply's against the specified "change" then adds to learning rate for change
                
        };
    }

    train(steps) {
        let trainData = steps.map(step => {
            let input = this.convertToInput(step.line, step.hint);
            let output = this.convertToInput(step.solution, step.hint)
            //input.push(step.solution);
            return input.concat(output);
        });
        console.log(trainData);
        this.net.train(trainData, this.trainOptions);
    }

    convertToInput(line, hints) {
        let normalHints = BrainSolution.normalizeHints(hints, line.length);
        let normalHintsLength = normalHints.length;
        for (let i = normalHintsLength; i < line.length; i++) {
            normalHints.push(0);
        }
        return [line.concat(normalHints)];
    }
}
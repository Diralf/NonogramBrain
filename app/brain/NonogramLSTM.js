const RNN = require('../../node_modules/brain.js/dist/recurrent/rnn');
RNN.default.defaults.formatDataOut = function (input, output) {
    if (this.dataFormatter !== null) {
        return this.dataFormatter.toCharacters(output);
    }
    return output;
}
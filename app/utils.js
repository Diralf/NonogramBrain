const fs = require('fs');

exports.saveSteps = (fileName, steps) => {
    fs.writeFileSync(fileName, JSON.stringify(steps));
}

exports.loadSteps = (fileName) => {
    let data = fs.readFileSync(fileName);
    return JSON.parse(data);
}

exports.saveNet = (name, net) => {
    let json = net.toJSON();
    fs.writeFileSync(name, JSON.stringify(json));
}

exports.loadNet = exports.loadSteps;
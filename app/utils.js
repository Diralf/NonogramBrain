const fs = require('fs');

exports.saveSteps = (fileName, steps) => {
    fs.writeFileSync(fileName, JSON.stringify(steps));
    console.log(`File ${fileName} is saved`);
}

exports.loadSteps = (fileName) => {
    let data = fs.readFileSync(fileName);
    console.log(`File ${fileName} is loaded`);
    return JSON.parse(data);
}

exports.saveNet = (name, net) => {
    let json = net.toJSON();
    fs.writeFileSync(name, JSON.stringify(json));
    console.log(`Network ${name} is saved`);
}

exports.loadNet = exports.loadSteps;
module.exports = (steps, brain) => {
    brain.train(steps);
    brain.save();
}
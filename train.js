module.exports = (steps, brain, callback) => {
    return brain.train(steps, callback)
        .then((res) => {
            brain.save();
            return res;
        });
}
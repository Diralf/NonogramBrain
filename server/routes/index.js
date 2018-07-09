var express = require('express');
var router = express.Router();
const brain = require('../../index');

let readyData = [];
let isEnd = false;

router.get('/message', function(req, res, next) {
  res.json('Welcome To React');
});

router.get('/trainstart', function (req,res, next) {
    brain.start(false, false, ['nonograms.org/Helicopter']);
    //brain.start(false, false, ['manual10-0'/*, 'manual10-50','manual10-150','manual10-250','manual10-1000'*/]);

    brain.trainNet((iterationData) => {
        let {error, iterations} = iterationData
        readyData.push({error, iterations});
        brain.brain.save();
    }).then(() => {
        isEnd = true;
    });

    res.json(true);
});

router.get('/trainerror', function (req, res, next) {
    let chunk = readyData.slice();
    readyData = [];
    if (isEnd) {
        res.json(false);
    } else {
        res.json(chunk);    
    }
    
});

module.exports = router;

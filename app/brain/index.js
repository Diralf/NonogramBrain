import brain from 'brain.js';



module.exports = (line, hints) => {
    let leftmost = pushLeft(line, hints);
    if (!leftmost) {
        return null;
    }

    let reverseLine = line.slice().reverse();
    let reverseHints = hints.slice().reverse();
    let rightmost = pushLeft(reverseLine, reverseHints).reverse();

    enumerate(leftmost);
    enumerate(rightmost);

    return leftmost.map((el, i) => {
        if (el === rightmost[i]) {
            return (el % 2) ? 1 : -1;
        }
        return line[i];
    });
};
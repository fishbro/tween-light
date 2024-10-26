var bounceIn = require('src/modules/tween/ease/bounceIn');
var bounceOut = require('./bounceOut');

export default function(k:number) {
    if (k < 0.5) {
        return bounceIn(k * 2) * 0.5;
    }

    return bounceOut(k * 2 - 1) * 0.5 + 0.5;
};

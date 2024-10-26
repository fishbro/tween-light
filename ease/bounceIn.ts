var bounceOut = require('./bounceOut');

export default function(k:number) {
    return 1 - bounceOut(1 - k);
};

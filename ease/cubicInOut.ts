export default function(k:number) {
    if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k + 2);
};

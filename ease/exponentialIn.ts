export default function(k:number) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
};

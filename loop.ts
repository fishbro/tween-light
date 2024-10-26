type Tween = {
    update: (time: number) => boolean;
};

const tweens: Tween[] = [];

const tweenManager = {
    add(tween: Tween): void {
        tweens.push(tween);
    },

    remove(tween: Tween): void {
        const index = tweens.indexOf(tween);
        if (index !== -1) {
            tweens.splice(index, 1);
        }
    },

    update(time?: number): boolean {
        if (tweens.length === 0) return false;

        const currentTime = time || Date.now();
        let i = 0;

        while (i < tweens.length) {
            if (tweens[i].update(currentTime)) {
                i++;
            } else {
                tweens.splice(i, 1);
            }
        }

        return true;
    }
};

export default tweenManager;

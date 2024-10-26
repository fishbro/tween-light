import linear from './ease/linear';
import loop from './loop';

type EasingFunction = (t: number) => number;
type TweenCallback = (object: Record<string, any>) => void;

class Tween {
    private object: Record<string, any>;
    private valuesStart: Record<string, number> = {};
    private valuesStartRepeat: Record<string, number> = {};
    private valuesEnd: Record<string, any> = {};
    private durationTime: number;
    private repeatCount: number;
    private delayTime: number;
    private isYoyo: boolean;
    private isPlaying: boolean = false;
    private reversed: boolean = false;
    private startTime: number = 0;
    private easingFunction: EasingFunction;
    private onStartCallback?: TweenCallback;
    private onStartCallbackFired: boolean = false;
    private onUpdateCallback?: TweenCallback;
    private onCompleteCallback?: TweenCallback;
    private onStopCallback?: TweenCallback;

    constructor(
        base:Record<string, any>,
         duration: number = 1000,
         repeat: number = 0,
         delay: number = 0,
         yoyo: boolean = false,
         easingFunction: EasingFunction = linear,
         onStart?: TweenCallback,
         onUpdate?: TweenCallback,
         onComplete?: TweenCallback,
         onStop?: TweenCallback
    ) {
        this.object = base;
        this.durationTime = duration;
        this.repeatCount = repeat;
        this.delayTime = delay;
        this.isYoyo = yoyo;
        this.easingFunction = easingFunction;
        this.onStartCallback = onStart;
        this.onUpdateCallback = onUpdate;
        this.onCompleteCallback = onComplete;
        this.onStopCallback = onStop;

        // Initialize starting values
        for (const field in base) {
            this.valuesStart[field] = parseFloat(base[field]);
        }
    }

    to(properties: Record<string, any>, ms?: number): this {
        if (ms) this.durationTime = ms;
        this.valuesEnd = properties;
        return this;
    }

    start(time?: number): this {
        loop.add(this);
        this.isPlaying = true;
        this.onStartCallbackFired = false;
        this.startTime = (time || Date.now()) + this.delayTime;

        for (const property in this.valuesEnd) {
            this.valuesStart[property] = this.object[property];
            this.valuesStartRepeat[property] = this.valuesStart[property] || 0;
        }

        return this;
    }

    stop(): this {
        if (!this.isPlaying) return this;

        loop.remove(this);
        this.isPlaying = false;
        this.onStopCallback?.(this.object);

        return this;
    }

    duration(ms: number): this {
        this.durationTime = ms;
        return this;
    }

    delay(amount: number): this {
        this.delayTime = amount;
        return this;
    }

    repeat(times: number): this {
        this.repeatCount = times;
        return this;
    }

    yoyo(bool: boolean = true): this {
        this.isYoyo = bool;
        return this;
    }

    ease(fn: EasingFunction): this {
        this.easingFunction = fn;
        return this;
    }

    onStart(callback: TweenCallback): this {
        this.onStartCallback = callback;
        return this;
    }

    onUpdate(callback: TweenCallback): this {
        this.onUpdateCallback = callback;
        return this;
    }

    onComplete(callback: TweenCallback): this {
        this.onCompleteCallback = callback;
        return this;
    }

    onStop(callback: TweenCallback): this {
        this.onStopCallback = callback;
        return this;
    }

    update(time: number): boolean {
        if (time < this.startTime) return true;

        if (!this.onStartCallbackFired) {
            this.onStartCallback?.(this.object);
            this.onStartCallbackFired = true;
        }

        const elapsed = Math.min((time - this.startTime) / this.durationTime, 1);
        const value = this.easingFunction(elapsed);

        for (const property in this.valuesEnd) {
            const start = this.valuesStart[property] || 0;
            const end = this.valuesEnd[property];
            this.object[property] = start + (end - start) * value;
        }

        this.onUpdateCallback?.(this.object);

        if (elapsed === 1) {
            if (this.repeatCount > 0) {
                if (isFinite(this.repeatCount)) this.repeatCount--;

                for (const property in this.valuesStartRepeat) {
                    if (this.isYoyo) {
                        const tmp = this.valuesStartRepeat[property];
                        this.valuesStartRepeat[property] = this.valuesEnd[property];
                        this.valuesEnd[property] = tmp;
                    }
                    this.valuesStart[property] = this.valuesStartRepeat[property];
                }

                if (this.isYoyo) this.reversed = !this.reversed;
                this.startTime = time + this.delayTime;

                return true;
            } else {
                this.onCompleteCallback?.(this.object);
                return false;
            }
        }

        return true;
    }
}

export default Tween;
export const update = loop.update;

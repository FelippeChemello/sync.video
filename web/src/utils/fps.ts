export default class Fps {
    private last = this.now();
    private rate = 0;

    private now() {
        return performance.now();
    }

    public tick() {
        const now = this.now();

        const diff = now - this.last;

        this.last = now;
        this.rate = 1000 / diff;
    }

    public getRate() {
        return Math.round(this.rate);
    }
}

import {Asset} from "./Asset";

export class Sound {
    private static _ctx: AudioContext | null = null;

    private _sourceNode: AudioBufferSourceNode | null = null;
    private _audioBuffer: AudioBuffer;
    private _startTime: number = 0;

    private _pannerNode: StereoPannerNode = Sound.ctx.createStereoPanner();
    private _gainNode: GainNode = Sound.ctx.createGain();

    /**
     * Play sounds
     * @param {string} asset sound name */
    constructor(asset: string) {
        this._audioBuffer = Asset.getSound(asset);
        this._gainNode.connect(this._pannerNode);
        this._pannerNode.connect(Sound.ctx.destination);
    }

    static get ctx(): AudioContext {
        if (!Sound._ctx) {
            Sound._ctx = new AudioContext();
        }
        return Sound._ctx;
    }

    get pan(): number {
        return this._pannerNode.pan.value;
    }

    set pan(value: number) {
        this._pannerNode.pan.value = value;
    }

    get volume(): number {
        return this._gainNode.gain.value;
    }

    set volume(value: number) {
        this._gainNode.gain.value = value;
    }

    get position(): number {
        if (!this._sourceNode) return 0;
        return Sound.ctx.currentTime - this._startTime;
    }

    get duration(): number {
        return this._audioBuffer.duration
    }

    play(force: boolean = false, loop: boolean = false): void {
        if (force) this.stop();
        else if (this._sourceNode) return; // If buffer exists - sound is playing

        this._startTime = Sound.ctx.currentTime;
        this._sourceNode = Sound.ctx.createBufferSource();
        this._sourceNode.loop = loop;
        this._sourceNode.buffer = this._audioBuffer;
        this._sourceNode.connect(this._gainNode);
        this._sourceNode.start();
        this._sourceNode.addEventListener('ended', () => this.stop());
    }

    stop(): void {
        if (!this._sourceNode) return;

        try {
            this._sourceNode.stop();
        } catch (e) {
            console.error(e)
        }
        this._sourceNode = null;
    }
}

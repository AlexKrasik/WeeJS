import {Asset} from "./Asset";

/**
 * Plays a preloaded audio asset through the Web Audio API.
 */
export class Sound {
    private static _ctx: AudioContext | null = null;

    private _sourceNode: AudioBufferSourceNode | null = null;
    private _audioBuffer: AudioBuffer;
    private _startTime: number = 0;

    private _pannerNode: StereoPannerNode = Sound.ctx.createStereoPanner();
    private _gainNode: GainNode = Sound.ctx.createGain();

    /**
     * Create a sound from a preloaded asset.
     * @param asset Asset name from {@link Asset.load}
     */
    constructor(asset: string) {
        this._audioBuffer = Asset.getSound(asset);
        this._gainNode.connect(this._pannerNode);
        this._pannerNode.connect(Sound.ctx.destination);
    }

    /**
     * Shared AudioContext used for decoding and playback.
     * @internal
     */
    static get ctx(): AudioContext {
        if (!Sound._ctx) {
            Sound._ctx = new AudioContext();
        }
        return Sound._ctx;
    }

    /** Stereo pan from -1 (left) to 1 (right). Default is 0 (center). */
    get pan(): number {
        return this._pannerNode.pan.value;
    }

    set pan(value: number) {
        this._pannerNode.pan.value = value;
    }

    /** Volume from 0 to 1. */
    get volume(): number {
        return this._gainNode.gain.value;
    }

    set volume(value: number) {
        this._gainNode.gain.value = value;
    }

    /** Current playback position in seconds. Returns 0 when not playing. */
    get position(): number {
        if (!this._sourceNode) return 0;
        return Sound.ctx.currentTime - this._startTime;
    }

    /** Total sound length in seconds. */
    get duration(): number {
        return this._audioBuffer.duration
    }

    /**
     * Start playback.
     * @param force If true, stop current playback and start over
     * @param loop If true, repeat until stopped
     */
    play(force: boolean = false, loop: boolean = false): void {
        if (force) {
            this.stop();
            console.log('force')
        } else if (this._sourceNode) return; // If buffer exists - sound is playing

        this._startTime = Sound.ctx.currentTime;
        this._sourceNode = Sound.ctx.createBufferSource();
        this._sourceNode.loop = loop;
        this._sourceNode.buffer = this._audioBuffer;
        this._sourceNode.connect(this._gainNode);
        this._sourceNode.addEventListener('ended', this._onEnded);
        this._sourceNode.start();
    }

    /** Stop playback immediately. */
    stop(): void {
        // nothing is playing - exit
        if (!this._sourceNode) return;

        // remove old event listener
        this._sourceNode.removeEventListener('ended', this._onEnded);

        try {
            this._sourceNode.stop();
        } catch (e) {
            console.error(e)
        }

        this._sourceNode = null;
    }

    private _onEnded = () => {
        this._sourceNode = null;
    };
}

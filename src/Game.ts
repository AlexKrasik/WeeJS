import type {Stage} from "./Stage";
import {Input} from "./Input";

/**
 * Creates the canvas, runs the main loop, and owns the active {@link Stage}.
 */
export class Game {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _canvas: HTMLCanvasElement;

    private _delta: number = 0;
    private _maxDelta: number = 1 / 60;
    private _lastFrameTime: number = 0;

    private _stage: Stage | null = null;

    /** Draw hitboxes and other debug overlays. */
    public debug: boolean = false;

    /**
     * Set up a new game and start the render loop.
     * @param width Canvas width in pixels
     * @param height Canvas height in pixels
     * @param parentSelector CSS selector for the canvas parent (falls back to document.body)
     */
    constructor(width: number = 320, height: number = 480, parentSelector: string) {
        Input._init();

        // create canvas element
        this._canvas = document.createElement("canvas");
        this._canvas.width = this._width = width;
        this._canvas.height = this._height = height;
        this._canvas.style.imageRendering = "pixelated";

        // add canvas to DOM
        const parentEl = document.querySelector(parentSelector) || document.body;
        parentEl.append(this._canvas);

        // start main loop
        requestAnimationFrame((time) => this.loop(time));
    }

    /**
     * Main game loop.
     * @param time Timestamp from requestAnimationFrame
     * @internal
     */
    private loop(time: number) {
        this._delta = (time - this._lastFrameTime) / 1000;
        this._lastFrameTime = time;

        //clear canvas
        this.ctx.fillStyle = "#111";
        this.ctx.fillRect(0, 0, this._width, this._height);

        // update current stage
        this.stage?._loop();

        // clear inputs data
        Input._clear();
        requestAnimationFrame((time) => this.loop(time));
    }

    /** Currently active stage. */
    get stage(): Stage | null {
        return this._stage;
    }

    set stage(s: Stage) {
        this._stage = s;
        this._stage.game = this;
    }

    /** Seconds since the last frame, clamped to a maximum of one frame at 60 FPS. */
    get delta() {
        return Math.min(this._delta, this._maxDelta);
    }

    /** Canvas 2D drawing context. */
    get ctx(): CanvasRenderingContext2D {
        const ctx = this._canvas.getContext("2d");
        if (!ctx) throw new Error("Can't get the canvas context");
        return ctx;
    }

}

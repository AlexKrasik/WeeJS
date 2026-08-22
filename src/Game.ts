import type {Stage} from "./Stage";
import {Input} from "./Input";

export class Game {


    private readonly _width: number;
    private readonly _height: number;
    private readonly _canvas: HTMLCanvasElement;

    private _delta: number = 0;
    private _maxDelta: number = 1 / 60;
    private _lastFrameTime: number = 0;

    private _stage: Stage | null = null;

    public debug: boolean = false;

    /**
     * Set up a new game
     * @param {number} width - Base width of your game.
     * @param {number} height -Base height of your game.
     * @param {string} parentSelector - Where game canvas is will be placed in DOM.
     */
    constructor(width: number = 320, height: number = 480, parentSelector: string) {
        Input.init();

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
     * Main game loop
     * @param time
     * @private
     */
    private loop(time: number) {
        this._delta = (time - this._lastFrameTime) / 1000;
        this._lastFrameTime = time;

        //clear canvas
        this.ctx.fillStyle = "#111";
        this.ctx.fillRect(0, 0, this._width, this._height);

        // update current stage
        this.stage?.loop();

        // clear inputs data
        Input._clear();
        requestAnimationFrame((time) => this.loop(time));
    }

    /**
     * Currently active stage
     */
    set stage(s: Stage) {
        this._stage = s;
        this._stage.game = this;
    }

    get stage(): Stage | null {
        return this._stage;
    }

    /**
     * Time passed since last frame
     */
    get delta() {
        return Math.min(this._delta, this._maxDelta);
    }

    /**
     * Canvas 2D context
     */
    get ctx(): CanvasRenderingContext2D {
        const ctx = this._canvas.getContext("2d");
        if (!ctx) throw new Error("Can't get the canvas context");
        return ctx;
    }

}
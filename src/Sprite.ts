import {Entity} from "./Entity";
import {Asset} from "./Asset";

/**
 * Drawable graphic for an {@link Entity}, with optional frame animation.
 */
export class Sprite {

    /** Offset X relative to the entity. */
    x: number = 0;
    /** Offset Y relative to the entity. */
    y: number = 0;
    /** Transformation pivot X. */
    pivotX: number = 0;
    /** Transformation pivot Y. */
    pivotY: number = 0;
    /** Rotation in degrees. */
    rotation: number = 0;
    /** Opacity from 0 to 1. */
    alpha: number = 1;
    /** Width of the area filled with the frame texture. */
    fillWidth: number;
    /** Height of the area filled with the frame texture. */
    fillHeight: number;
    /** Horizontal scale (1 = original size). */
    scaleX: number = 1;
    /** Vertical scale (1 = original size). */
    scaleY: number = 1;
    /** Overall scale (1 = original size). Independent of scaleX and scaleY */
    scale: number = 1;

    /** Entity this sprite is attached to. */
    entity!: Entity;
    // bitmapData of sprite
    private _bitmap!: ImageBitmap;
    // array of frames bitmap
    private _fA: ImageBitmap[] = [];
    // sequence of current animation
    private _aC: number[] = [0]
    // current animation speed
    private _aS: number = 1;
    // current frame index in animation sequence
    private _aI: number = 0;
    // time from last frame change
    private _aT: number = 0;
    //frame width/height
    private readonly _fW: number;
    private readonly _fH: number;
    // bitmap of current frame in animation sequence
    private _fB!: ImageBitmap;

    /**
     * Create a sprite from a preloaded image.
     * @param asset Image name from {@link Asset.load}
     * @param width Width of one animation frame; 0 uses the full image width
     * @param height Height of one animation frame; 0 uses the full image height
     * @param x Start X when clipping from the source image
     * @param y Start Y when clipping from the source image
     * @param cropWidth Width to clip; 0 uses the rest of the image
     * @param cropHeight Height to clip; 0 uses the rest of the image
     */
    constructor(asset: string, width: number = 0, height: number = 0, x: number = 0, y: number = 0, cropWidth: number = 0, cropHeight: number = 0) {
        const srcBitmap = Asset.getImage(asset);

        cropWidth = cropWidth || srcBitmap.width - x;
        cropHeight = cropHeight || srcBitmap.height - y;

        this._fW = this.fillWidth = width < cropWidth ? width || cropWidth : cropWidth;
        this._fH = this.fillHeight = height < cropHeight ? height || cropHeight : cropHeight;

        createImageBitmap(srcBitmap, x, y, cropWidth, cropHeight).then((clippedBitmap) => {
            this._bitmap = clippedBitmap;
            this._cacheFrames().catch(err => console.error(err));
        });
    }

    /**
     * Slice the spritesheet into frames.
     * @internal
     */
    private async _cacheFrames() {
        const rowCount = (this._bitmap.height - (this._bitmap.height % this._fH)) / this._fH;
        const colCount = (this._bitmap.width - (this._bitmap.width % this._fW)) / this._fW;

        let frameCount = 0;

        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < colCount; x++) {
                this._fA[frameCount] = await createImageBitmap(this._bitmap, x * this._fW, y * this._fH, this._fW, this._fH);
                frameCount++;
            }
        }
        this._fB = this._fA[0];
    }

    /**
     * Draw the current frame to the game canvas.
     * @internal
     */
    _render() {
        this._updateFrame();
        const ctx = this.entity.stage.game.ctx;
        ctx.save();

        if (this._fB) {
            const camera = this.entity.stage.camera;

            // position on Stage with camera offset
            const sX = this.entity.x + this.x + camera.x + this.pivotX
            const sY = this.entity.y + this.y + camera.y + this.pivotY

            // renderPoint
            const rX = this.entity.stage.game.pixelPerfect ? Math.round(sX) : sX;
            const rY = this.entity.stage.game.pixelPerfect ? Math.round(sY) : sY;

            ctx.translate(rX, rY);

            if (this.rotation != 0) ctx.rotate((this.rotation * Math.PI) / 180);
            if (this.alpha != 1) ctx.globalAlpha = this.alpha;
            if (this.scaleX != 1 || this.scaleY != 1 || this.scale != 1) ctx.scale(this.scaleX * this.scale, this.scaleY * this.scale);
            // render or fill area with frame
            if (this.fillWidth == this._fW && this.fillHeight == this._fH) {
                ctx.drawImage(this?._fB, -this.pivotX, -this.pivotY);
            } else {
                const pattern = ctx.createPattern(this._fB, 'repeat');
                if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(-this.pivotX, -this.pivotY, this.fillWidth, this.fillHeight);
                }
            }
        }

        ctx.restore();
    }

    /**
     * Advance the animation frame if needed.
     * @internal
     */
    private _updateFrame() {
        const time = performance.now() - this._aT;
        if (time > 1000 / this._aS) {
            this._aT = performance.now();
            this._aI = this._aI >= this._aC.length - 1 ? 0 : this._aI + 1;
        }
        this._fB = this._fA[this._aC[this._aI]];
    }

    /**
     * Play an animation sequence.
     * @param animation Frame indices, e.g. `[0, 1, 2]`
     * @param speed Frames per second
     * @param force Restart even if the same sequence is already playing
     */
    play(animation: number[] = [0], speed: number = 1, force: boolean = false) {
        if (animation.toString() !== this._aC.toString() || force) {
            this._aC = animation;
            this._aT = performance.now();
            this._aS = speed;
            this._aI = 0;
        }
    }
}

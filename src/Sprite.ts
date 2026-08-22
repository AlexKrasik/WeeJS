import {Entity} from "./Entity";
import {Asset} from "./Asset";

export class Sprite {
    /**
     * Class for all graphics that can be drawn by Entity.
     * @param {string} asset image name
     * @param {number} width width of single animation frame. null - for whole image width
     * @param {number} height height of single animation frame. null - for whole image height
     * @param {number} x start x position to clip from source image
     * @param {number} y start y position to clip from source image
     * @param {number} [cropWidth] width of rectangle to clip from source image. null - for whole image width
     * @param {number} [cropHeight] height of rectangle to clip from source image. null - for whole image height
     */
    constructor(asset: string, width: number, height: number, x: number = 0, y: number = 0, cropWidth?: number, cropHeight?: number) {
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


    render() {
        this._updateFrame();
        const ctx = this.entity.stage.game.ctx;
        ctx.save();

        if (this._fB) {
            // renderPoint
            const rX = Math.round(this.entity.x + this.x - this.pivotX);
            const rY = Math.round(this.entity.y + this.y - this.pivotY);

            ctx.translate(rX, rY);

            if (this.rotation != 0) ctx.rotate((this.rotation * Math.PI) / 180);
            if (this.alpha != 1) ctx.globalAlpha = this.alpha;
            if (this.scaleX != 1 || this.scaleY != 1) ctx.scale(this.scaleX, this.scaleY);
            // render or fill area with frame
            if (this.fillWidth == this._fW && this.fillHeight == this._fH) {
                ctx.drawImage(this?._fB, this.pivotX, this.pivotY);
            } else {
                const pattern = ctx.createPattern(this._fB, 'repeat');
                if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(this.pivotX, this.pivotY, this.fillWidth, this.fillHeight);
                }
            }
        }

        ctx.restore();
    }

    /**
     * Play animation sequence
     * @param {number[]} animation sequence of frames
     * @param {number} speed animation speed (frames per second)
     * @param {boolean} force should animation start over if already playing
     */
    play(animation = [0], speed = 1, force = false) {
        if (animation != this._aC || force) {
            this._aC = animation;
            this._aT = performance.now();
            this._aS = speed;
            this._aI = 0;
        }
    }

    private _updateFrame() {
        const time = performance.now() - this._aT;
        if (time > 1000 / this._aS) {
            this._aT = performance.now();
            this._aI = this._aI >= this._aC.length - 1 ? 0 : this._aI + 1;
        }
        this._fB = this._fA[this._aC[this._aI]];
    }

    // entity this sprite assigned to
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
     * X position
     */
    x: number = 0;
    /**
     * Y position
     */
    y: number = 0;
    /**
     * X position of transformation pivot point
     */
    pivotX: number = 0;
    /**
     * Y position of transformation pivot point
     */
    pivotY: number = 0;
    /**
     * Image rotation;
     */
    rotation: number = 0;
    /**
     * Sprite transparency
     */
    alpha: number = 1;
    /**
     * Width of rectangle to be filled with texture
     */
    fillWidth: number;
    /**
     * Height of rectangle to be filled with texture
     */
    fillHeight: number;
    // Horizontal scale of image (1 - original)
    scaleX: number = 1;
    // Vertical scale of image (1 - original)
    scaleY: number = 1;

}
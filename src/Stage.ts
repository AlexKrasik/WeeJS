import {Sprite} from "./Sprite";
import {Entity} from "./Entity";
import {Game} from "./Game";

/**
 * Scene that holds entities and runs their updates each frame.
 * Override {@link Stage.update} for stage-level logic.
 */
export class Stage {

    /** Game that owns this stage. */
    public game!: Game;
    public camera: { x: number, y: number } = {x: 0, y: 0};
    private _entityList: Entity[] = [];
    private _needReorder: boolean = false;

    /** Create an empty stage. */
    constructor() {
    }

    /**
     * Called by {@link Game} each frame.
     * @internal
     */
    _loop() {
        this.update();
        if (this._needReorder) {
            this._entityList.sort((a, b) => (a.z > b.z) ? 1 : -1);
            this._needReorder = false;
        }

        this._entityList.forEach(e => {
            e.update();
            e.sprite?._render();
        });

        if (this.game.debug) {
            const ctx = this.game.ctx;

            // draw hitboxes
            this._entityList.forEach(e => e._drawHitbox());

            // performance (smoothed over last frames)
            ctx.fillStyle = "#0006";
            ctx.fillRect(0, 0, 80, 30);

            ctx.fillStyle = "#FFF";
            ctx.font = "10px monospace";
            ctx.fillText(`fps: ${Math.round(this.game.fps)}`, 8, 12);
            ctx.fillText(`frame: ${Math.round(this.game.avgDelta * 1000)}ms`, 8, 24);
        }
    }

    /**
     * Called every frame before entities update. Override in subclasses for stage logic.
     */
    update() {
    }

    /**
     * Add an entity to this stage.
     * @param e Entity to add
     * @returns The same entity
     */
    add(e: Entity) {
        this._entityList.push(e);
        e.stage = this;
        return e;
    }

    /**
     * Remove an entity from this stage.
     * @param e Entity to remove
     */
    remove(e: Entity) {
        this._entityList = this._entityList.filter(c => c != e);
    }

    /**
     * Create and position Entity with Sprite.
     * @param sprite Sprite to add on Stage
     * @param x X position on the Stage
     * @param y Y position on the Stage
     * @param z Render order; lower values render first
     * */
    addSprite(sprite: Sprite, x: number = 0, y: number = 0, z: number = 0) {
        const e = new Entity(x, y);
        this.add(e);
        e.sprite = sprite;
        e.z = z;
        e.drawDebug = false;
        return e;
    }

    /** Entities currently on this stage. */
    get entityList() {
        return this._entityList;
    }

    /**
     * Mark the entity list for z-order sort before the next frame.
     * @internal
     */
    _reorderZ() {
        this._needReorder = true;
    }

}

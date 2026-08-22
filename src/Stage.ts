import {Entity} from "./Entity";
import {Game} from "./Game";

/**
 * Scene that holds entities and runs their updates each frame.
 * Override {@link Stage.update} for stage-level logic.
 */
export class Stage {

    /** Game that owns this stage. */
    game!: Game;
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
            this._entityList.forEach(e => {
                //entity hitbox
                ctx.strokeStyle = e.hitboxColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(Math.floor(e.x) + .5 + e.originX, Math.floor(e.y) + .5 + e.originY, e.width, e.height);
                // entity position
                ctx.strokeStyle = "#00DDFF";
                ctx.strokeRect(Math.floor(e.x) - .5, Math.floor(e.y) - .5, 2, 2);
            });
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

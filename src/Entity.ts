import {Stage} from "./Stage";
import {Sprite} from "./Sprite";
import {Game} from "./Game";

/**
 * Basic game object with position, hitbox, and optional sprite.
 * Override {@link Entity.update} for per-frame logic.
 */
export class Entity {
    /** X position on the stage. */
    x: number = 0;
    /** Y position on the stage. */
    y: number = 0;
    /** Hitbox X offset from entity position. */
    originX: number = 0;
    /** Hitbox Y offset from entity position. */
    originY: number = 0;
    /** Hitbox width. */
    width: number = 0;
    /** Hitbox height. */
    height: number = 0;
    /** Collision group name used by {@link Entity.collide}. */
    group: string = '';
    /** Stage this entity belongs to. */
    stage!: Stage;
    /** Draw position and hitbox in debug mode*/
    drawDebug = true;

    private _z: number = 0;
    private _sprite: Sprite | null = null;

    /**
     * Create an entity.
     * @param x Horizontal position on the stage
     * @param y Vertical position on the stage
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Called every frame before render. Override in subclasses for game logic.
     */
    update() {
    }

    /** Sprite drawn for this entity, if any. */
    get sprite(): Sprite | null {
        return this._sprite;
    }

    set sprite(s: Sprite) {
        this._sprite = s;
        this._sprite.entity = this;
    }

    /**
     * Find overlapping entities in a collision group.
     * @param group Collision group name
     * @param offsetX Hitbox X offset for prediction
     * @param offsetY Hitbox Y offset for prediction
     * @returns Entities from the group that overlap this hitbox
     */
    collide(group: string, offsetX: number = 0, offsetY: number = 0): Entity[] {
        const result: Entity[] = [];
        this.stage?.entityList.forEach(e => {
            if (e != this && e.group == group) {
                if (this.collideWith(e, offsetX, offsetY))
                    result.push(e);
            }
        });
        return result;
    }

    /**
     * Check overlap with a specific entity.
     * @param e Entity to test against
     * @param offsetX Hitbox X offset for prediction
     * @param offsetY Hitbox Y offset for prediction
     * @returns True if hitboxes overlap
     */
    collideWith(e: Entity, offsetX: number = 0, offsetY: number = 0): boolean {
        const l1 = this.x + this.originX + offsetX;
        const r1 = this.x + this.originX + offsetX + this.width;
        const t1 = this.y + this.originY + offsetY;
        const b1 = this.y + this.originY + offsetY + this.height;

        const l2 = e.x + e.originX;
        const r2 = e.x + e.originX + e.width;
        const t2 = e.y + e.originY;
        const b2 = e.y + e.originY + e.height;

        return (l1 <= r2 && l2 <= r1 && t1 <= b2 && t2 <= b1);
    }

    /**
     * Check overlap with a point.
     * @param x of a point
     * @param y of a point
     * @returns True if point is in hitbox
     */
    collidePoint(x: number = 0, y: number = 0) {
        const l = this.x + this.originX;
        const r = this.x + this.originX + this.width;
        const t = this.y + this.originY;
        const b = this.y + this.originY + this.height;
        return x >= l && x <= r && y >= t && y <= b;
    }

    /** Render order; lower values render first. */
    get z() {
        return this._z;
    }

    set z(value: number) {
        this._z = value;
        this.stage?._reorderZ();
    }

    /** Seconds since the last frame (from {@link Game.delta}). */
    get delta(): number {
        return this.stage?.game.delta;
    }

    /** Game instance */
    get game(): Game {
        return this.stage?.game;
    }

    /** Render hitbox of the entity */
    _drawHitbox() {
        if (!this.drawDebug) return;

        const ctx = this.stage.game.ctx;
        const cam = this.stage.camera;

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.floor(this.x + cam.x) + .5 + this.originX, Math.floor(this.y + cam.y) + .5 + this.originY, this.width, this.height);
        // entity position
        ctx.strokeStyle = "#00DDFF";
        ctx.strokeRect(Math.floor(this.x + cam.x) - .5, Math.floor(this.y + cam.y) - .5, 2, 2);
    }

}

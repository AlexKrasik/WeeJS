import {Stage} from "./Stage";
import {Sprite} from "./Sprite";

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
    /** Hitbox outline color when {@link Game.debug} is on. */
    hitboxColor: string = "#FFF"
    /** Stage this entity belongs to. */
    stage!: Stage;

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

    /** Draw order; lower values render first. */
    get z() {
        return this._z;
    }

    set z(value: number) {
        this._z = value;
        this.stage?._reorderZ();
    }

    /** Seconds since the last frame (from {@link Game.delta}). */
    get delta(): number {
        return this.stage.game.delta;
    }

}

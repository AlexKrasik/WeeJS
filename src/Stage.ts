import {Entity} from "./Entity";
import {Game} from "./Game";

export class Stage {

    game: Game = null;
    private _entityList: Entity[] = [];
    private _needReorder: boolean = false;

    constructor() {
    }

    loop(delta:number) {
        this.update(delta);
        if (this._needReorder) {
            this._entityList = this._entityList.sort((a, b) => (a.z > b.z) ? 1 : -1);
        }
        this._entityList.forEach(e => {
            e.loop(delta);
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

    update(delta:number) {
    }

    add(e: Entity) {
        this._entityList.push(e);
        e.stage = this;
        return e;
    }

    remove(e: Entity) {
        this._entityList = this._entityList.filter(c => c != e);
    }

    get entityList() {
        return this._entityList;
    }
    reorderZ() {
        this._needReorder = true;
    }

}
interface KeyState {
    pressed: boolean;
    down: boolean;
    released: boolean;
}

export class Input {
    private static _keys = new Map<string, KeyState>();

    static init() {
        addEventListener('keydown', e => {
            const key = this._key(e.code)
            if (!key.down) key.pressed = true;
            key.down = true;
            key.released = false;
        });
        addEventListener('keyup', e => {
            const key = this._key(e.code);
            if (key.down) key.released = true;
            key.down = false;
            key.pressed = false;
        });
    }

    static _clear() {
        for (const state of Input._keys.values()) {
            state.pressed = false;
            state.released = false;
        }
    }

    static _key(code: string) {
        let state = Input._keys.get(code);
        if (!state) {
            state = {pressed: false, down: false, released: false};
            Input._keys.set(code, state);
        }
        return state;
    }

    static pressed(code: string) {
        return this._key(code).pressed;
    }

    static down(code: string) {
        return this._key(code).down;
    }

    static released(code: string) {
        return this._key(code).released;
    }
}

interface KeyState {
    pressed: boolean;
    down: boolean;
    released: boolean;
}

/**
 * Keyboard input helpers. Use {@link KeyboardEvent.code} values such as `'KeyA'` or `'ArrowLeft'`.
 */
export class Input {
    private static _keys = new Map<string, KeyState>();
    private static _ready: boolean = false;

    /**
     * Attach keyboard listeners once.
     * @internal
     */
    static _init() {
        if (Input._ready) return;
        Input._ready = true;

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

    /**
     * Clear one-frame pressed/released flags after each update.
     * @internal
     */
    static _clear() {
        for (const state of Input._keys.values()) {
            state.pressed = false;
            state.released = false;
        }
    }

    /**
     * Get or create key state.
     * @param code KeyboardEvent.code, e.g. `'KeyA'`, `'ArrowLeft'`
     */
    private static _key(code: string) {
        let state = Input._keys.get(code);
        if (!state) {
            state = {pressed: false, down: false, released: false};
            Input._keys.set(code, state);
        }
        return state;
    }

    /**
     * True while the key is held down.
     * @param code KeyboardEvent.code, e.g. `'KeyA'`, `'ArrowLeft'`
     */
    static down(code: string) {
        return this._key(code).down;
    }

    /**
     * True only on the frame the key was pressed.
     * @param code KeyboardEvent.code, e.g. `'KeyA'`, `'ArrowLeft'`
     */
    static pressed(code: string) {
        return this._key(code).pressed;
    }

    /**
     * True only on the frame the key was released.
     * @param code KeyboardEvent.code, e.g. `'KeyA'`, `'ArrowLeft'`
     */
    static released(code: string) {
        return this._key(code).released;
    }
}

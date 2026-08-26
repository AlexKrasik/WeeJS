interface KeyState {
    pressed: boolean;
    down: boolean;
    released: boolean;
}

/**
 * Input helpers
 */
export class Input {
    private static _keys = new Map<string, KeyState>();
    private static _ready: boolean = false;

    static mouse: { x: number, y: number, wheel: number, left: KeyState, right: KeyState, middle: KeyState, } = {
        /**
         * Mouse x position on game canvas
         */
        x: 0,
        /**
         * Mouse y position on game canvas
         */
        y: 0,
        /**
         * Mouse wheel delta
         */
        wheel: 0,
        /**
         * Mouse left button state
         */
        left: {pressed: false, down: false, released: false},
        /**
         * Mouse right button state
         */
        right: {pressed: false, down: false, released: false},
        /**
         * Mouse middle (wheel) button state
         */
        middle: {pressed: false, down: false, released: false},
    }

    /**
     * Attach input listeners once.
     * @internal
     */
    static _init(c: HTMLCanvasElement) {
        if (Input._ready) return;
        Input._ready = true;

        // Keyboard
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

        // Mouse
        addEventListener('mouseup', e => {
            let button = this._mouseBtn(e.button);
            if (!button) return;

            if (button.down) button.released = true;
            button.down = false;
            button.pressed = false;
        })
        c.addEventListener('mousedown', e => {
            let button = this._mouseBtn(e.button);
            if (!button) return;

            if (!button.down) button.pressed = true;
            button.down = true;
            button.released = false;
        })
        c.addEventListener('wheel', e => {
            e.preventDefault();
            this.mouse.wheel += e.deltaY;
        }, {passive: false});
        c.addEventListener('mousemove', e => {
            const r = c.getBoundingClientRect();
            this.mouse.x = (e.clientX - r.left) * (c.width / r.width);
            this.mouse.y = (e.clientY - r.top) * (c.height / r.height);
        })
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

        Input.mouse.left.pressed = Input.mouse.right.pressed = Input.mouse.middle.pressed = false;
        Input.mouse.left.released = Input.mouse.right.released = Input.mouse.middle.released = false;
        Input.mouse.wheel = 0;
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
     * Get mouse button state.
     * @param button MouseEvent.button, 0 - left, 1 - middle(wheel), 2 - right
     */
    private static _mouseBtn(button: number): KeyState | undefined {
        switch (button) {
            case 0:
                return Input.mouse.left
            case 1:
                return Input.mouse.middle
            case 2:
                return Input.mouse.right
            default:
                return;
        }

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

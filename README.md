# WeeJS

Minimal HTML5 2D game engine

## Quick start

### Create game instance

```js
import {Asset, Game, Stage, Entity, Sprite, Input} from "/wee.es.js";

// preload chicken asset
await Asset.load({name: "CHICKEN", path: "./assets/gfx/chicken.png", type: "image"});

// create Game, add to document.body
const g = new Game(240, 160, 'body');
g.debug = true; //show debug graphics
```

<img width="480" height="320" alt="empty" src="https://github.com/user-attachments/assets/f13d5fe4-3402-4412-aef8-3985ca502cd1" />

### Create level and entity

```js
// create Stage / make it active
const level = new Stage();
g.stage = level;

// create character / add to Level
const player = new Entity(120, 80);
level.add(player);

// Add Sprite to Character / center sprite and sprite pivot point
player.sprite = new Sprite('CHICKEN', 16, 16);

// align sprite on entity. 
// not necessary, but it`s easier when chicken legs in same position as entity itself
player.sprite.x = -8;
player.sprite.y = -12;

// sprite transformation pivot (need for later)
player.sprite.pivotX = -8;
```

<img width="480" height="320" alt="1_chicken" src="https://github.com/user-attachments/assets/5753048a-efc6-4ff9-91cb-18adf6b17a34" />

### Input handling, move

```js

// Make input for player
player.update = function () {
    const speed = 50 * this.delta; //50px per sec
    const direction = {x: 0, y: 0}; //direction

    // change direction and animation by arrow keys
    if (Input.down('ArrowLeft'))
        direction.x = -1;
    else if (Input.down('ArrowRight'))
        direction.x = 1;

    if (Input.down('ArrowDown'))
        direction.y = 1;
    else if (Input.down('ArrowUp'))
        direction.y = -1;

    this.x += direction.x * speed;
    this.y += direction.y * speed;
}
```

<img width="480" height="320" alt="2_walk" src="https://github.com/user-attachments/assets/e9d14979-9f80-48d9-a841-0e72ea1689d4" />

### Animation and sprite transformation

Let's complete `player.update` function with animation

```js
player.update = function () {
    const speed = 50 * this.delta;
    const direction = {x: 0, y: 0};

    if (Input.down('ArrowLeft'))
        direction.x = -1;
    else if (Input.down('ArrowRight'))
        direction.x = 1;

    if (Input.down('ArrowDown'))
        direction.y = 1;
    else if (Input.down('ArrowUp'))
        direction.y = -1;

    this.x += direction.x * speed;
    this.y += direction.y * speed;

// play animation by direction
    if (direction.x === 0 && direction.y === 0)
        this.sprite.play([0, 0, 0, 0, 0, 1], 12); // idle animation
    else
        this.sprite.play([4, 5, 6, 7], 12); // run animation


// we can flip sprite by making scaleX negative
    this.sprite.scaleX = Math.sign(direction.x) || this.sprite.scaleX;
}
```

<img width="480" height="320" alt="3_animation" src="https://github.com/user-attachments/assets/bdaec1d1-eec8-43e3-a57f-f994ab01b72c" />

## API

For more information go to [API reference](API.md)

## Credits

Beautiful sprite set used in examples is [Sprout Lands](https://cupnooble.itch.io/sprout-lands-asset-pack) made
by [CUPNOOBLE](https://cupnooble.itch.io/)

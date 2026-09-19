## Table of contents

- [Asset](#asset)
  - [Asset structure](#asset-structure)
  - [Loading](#loading)
  - [Monitoring progress](#monitoring-progress)
- [Game](#game)
  - [Game constructor](#game-constructor)
  - [Smoothing nuance - `game.pixelPerfect`](#smoothing-nuance---gamepixelperfect)
  - [Debug visuals - `game.debug`](#debug-visuals---gamedebug)
  - [Delta time - `game.delta`](#delta-time---gamedelta)
  - [Stage activation - `game.stage`](#stage-activation---gamestage)
- [Stage](#stage)
  - [Creating a stage](#creating-a-stage)
  - [Game instance](#game-instance)
  - [Add \ remove entity - `stage.add` and `stage.remove`](#add-remove-entity---stageadd-and-stageremove)
  - [Add graphics](#add-graphics)
  - [Update function - `stage.update`](#update-function---stageupdate)
  - [Camera control - `stage.camera`](#camera-control---stagecamera)
- [Entity](#entity)
  - [Creating entity](#creating-entity)
  - [Stage instance](#stage-instance)
  - [Update function](#update-function)
  - [Render order](#render-order)
  - [Hitbox](#hitbox)
  - [Collision handling and Collision group](#collision-handling-and-collision-group)
- [Sprite](#sprite)
  - [Creating sprite](#creating-sprite)
  - [Shared spritesheet](#shared-spritesheet)
  - [Animation](#animation)
  - [Pattern](#pattern)
  - [Animated patterns](#animated-patterns)
  - [Transformations](#transformations)
- [Input](#input)
  - [Keyboard](#keyboard)
  - [Mouse](#mouse)
- [Sound](#sound)
  - [Browser autoplay policy](#browser-autoplay-policy)
  - [Creating Sound](#creating-sound)
  - [Play](#play)
  - [Stop](#stop)
  - [Volume](#volume)
  - [Stereo panning](#stereo-panning)
  - [Duration and position](#duration-and-position)
- [Credits](#credits)

## Asset

All graphics and sound effects should be preloaded.

### Asset structure

Single asset is a plain object, must contain 3 properties

**name**:`string` - unique name for asset\
**path**:`string` - path/url to asset \
**type**:`string` - asset type, either **image** or **audio**

```js
const playerAsset = {
    name: "MAIN_HERO",
    path: 'path/to/hero_sprite.png',
    type: 'image'
}
```

### Loading

`Asset.load(assets, ?onProgress)` - async function, use it with `await` or `.then()`

**assets**:`object | object[]` - single asset or array of assets \
**onProgress**:`function(loaded, total)` - optional. Callback function, fires after every time asset is loaded

```js
import {Asset} from "/wee.es.js";

const assetList = [
    {name: 'SPRITE_PLAYER', path: '/assets/gfx/player.png', type: "image"},
    {name: 'SPRITE_ENEMY1', path: '/assets/gfx/enemy_1.png', type: "image"},
    {name: 'SPRITE_ENEMY2', path: '/assets/gfx/enemy_2.png', type: "image"},
    {name: 'SPRITE_TILESET', path: '/assets/gfx/tiles.png', type: "image"},
    {name: 'SFX_BGM', path: '/assets/sfx/music.mp3', type: "audio"},
    {name: 'SFX_JUMP', path: '/assets/sfx/bounce.mp3', type: "audio"},
    {name: 'SFX_GAMEOVER', path: '/assets/sfx/sad_jingle.mp3', type: "audio"},
];

await Asset.load(assetList);
```

### Monitoring progress

You can monitor loading progress with `onProgress` callback function. \

**loaded**:`number` - count of already loaded assets \
**total**:`number` - total count assets passed to load function

Here we made simple console logger:

```js
import {Asset} from "/wee.es.js";

const assetList = [
    {name: 'SPRITE_PLAYER', path: '/assets/gfx/player.png', type: "image"},
    {name: 'SPRITE_ENEMY1', path: '/assets/gfx/enemy_1.png', type: "image"},
    {name: 'SPRITE_ENEMY2', path: '/assets/gfx/enemy_2.png', type: "image"},
    {name: 'SPRITE_TILESET', path: '/assets/gfx/tiles.png', type: "image"},
    {name: 'SFX_BGM', path: '/assets/sfx/music.mp3', type: "audio"},
    {name: 'SFX_JUMP', path: '/assets/sfx/bounce.mp3', type: "audio"},
    {name: 'SFX_GAMEOVER', path: '/assets/sfx/sad_jingle.mp3', type: "audio"},
];

const onProgress = function (loaded, total) {
    console.log(`Loading progress: ${loaded} / ${total}`);
    if (loaded === total) console.log('Complete!')
}

await Asset.load(assetList, onProgress);
```

Console output:

```terminaloutput
Loading progress: 1 / 7 
Loading progress: 2 / 7 
Loading progress: 3 / 7
Loading progress: 4 / 7
Loading progress: 5 / 7
Loading progress: 6 / 7
Loading progress: 7 / 7
Complete!
```

## Game

### Game constructor

Entry point. Creates canvas and starts main loop

**width**:`number` - width of a game \
**height**:`number` - height of a game \
**parentSelector**:`string` - selector of element where game canvas be placed. Fallback to document.body

```html
<!-- index.html -->
<head>
  <script src="./myGame.js" type="module"></script>
</head>
<body>
<div id="game"></div>
</body>
```

```js
/** myGame.js */
import {Game} from "/wee.es.js";

// Create 480px by 320px canvas and place it in #game
const myGame = new Game(480, 320, '#game');
```

### Smoothing nuance - `game.pixelPerfect`

By default the canvas smooths scaled images, which makes pixel art look blurry.
In WeeJS image smoothing is off (`pixelPerfect` defaults to true).

```js
/** myGame.js */
import {Game} from "/wee.es.js";

const myGame = new Game(480, 320, '#game');

// Want my smoothing back
myGame.pixelPerfect = false;
```

<img width="768" height="320" alt="pixelPerfect effect on pixel art" src="https://github.com/user-attachments/assets/838caee1-386e-4f85-868b-405bf44ac44e" />

### Debug visuals - `game.debug`

```js
/** myGame.js */
import {Game} from "/wee.es.js";

const myGame = new Game(480, 320, '#game');

// Enable debug visuals
myGame.debug = true;
```

<img width="480" height="320" alt="debug view" src="https://github.com/user-attachments/assets/6279ef0d-ef2f-4ff4-82f8-4c6b7b90defe" />

### Delta time - `game.delta`

Time passed since last frame is sec. Clamped by 1/30 of sec. \
Use it to make timers, interpolate movements (like in quick start example) or transformations. \
More details in future examples

```js
myGame.delta // ~ 0.013
```

### Stage activation - `game.stage`

Only one stage is active and updated by the game.

```js
/** myGame.js */
import {Game} from "/wee.es.js";

// TestStage extends Stage
import {TestStage} from "/src/stages/TestStage.js";

const myGame = new Game(480, 320, '#game');

myGame.stage = new TestStage(); // Now stage is a new TestStage
```

## Stage

Game "scene". Title screen, main menu, game levels, etc

### Creating a stage

Stage constructor has no arguments. Just function used to fill Stage with entities.

```js
/** TestStage.js */
import {Stage} from "/wee.es.js";

class TestStage extends Stage {
    constructor() {
        super();

        /** Here we can prepopulate Stage with entities */

    }
}
```

### Game instance

Stage has access to game instance, after being activated;

```js

myGame.stage = new TestStage()

class TestStage extends Stage {
    constructor() {
        super();
        this.game // null
    }

    // level active and updates by game
    update() {
        this.game // myGame instance
    }
}
```

### Add \ remove entity - `stage.add` and `stage.remove`

**add (e: Entity)**  - spawns entity to Stage\
**remove (e: Entity)**  - remove entity from Stage

```js
import {Stage} from "/wee.es.js";
import {Chicken} from "/src/mobs/Chicken.js";

class TestStage extends Stage {
    constructor() {
        super();

        const chicken = new Chicken(120, 80); // create new Chicken
        this.add(chicken); // spawn it on stage
    }
}
```

### Add graphics

Sometimes you need to add decorative graphic on stage

**addSprite (sprite: Sprite, x:number, y:number, z:number):Entity** - create dummy entity with sprite place it (`x`,`y`)
position `z` layer.

**sprite**:`Sprite` - sprite to add on stage \
**x**:`number` - X position on the Stage. default = 0 \
**y**:`number` - Y position on the Stage. default = 0 \
**z**:`number` - entity render order. default = 0

Returns the created entity (same as `add`), so you can keep a reference and `remove` it later.

```js
const tree = new Sprite('TREE', 16, 32);
this.addSprite(tree, 100, 300); //Creates entity with tree sprite and place it in (100, 300); 
```

### Update function - `stage.update`

If stage is active this function will be called every frame.

In example, we update timer, and remove added chicken when minute passes;

```js
/** StartScreen.js */
import {Stage} from "/wee.es.js";
import {Chicken} from "/src/mobs/Chicken.js";

class TestStage extends Stage {
    timer = 0; // init timer
    chick = new Chicken(120, 80);

    constructor() {
        super();
        this.add(this.chick);
    }

    update() {
        this.timer += this.game.delta; // update timer
        if (this.timer > 60) //minute passed
            this.remove(this.chick) // remove chicken
    }
}
```

### Camera control - `stage.camera`

Camera position is top left corner point \
Let's make camera follow our chicken

```js
import {Stage} from "/wee.es.js";
import {Chicken} from "/src/mobs/Chicken.js";

class TestStage extends Stage {
    chick = new Chicken(120, 80);

    constructor() {
        super();
        this.add(this.chick);
    }

    update() {
        //move camera to the chicken position with offset by half of the screen
        this.camera.x = this.game.width / 2 - this.chick.x;
        this.camera.y = this.game.height / 2 - this.chick.y;
    }
}
```

<img width="480" height="320" alt="camera offset" src="https://github.com/user-attachments/assets/ebe1add9-116d-419b-bd46-1df8eade189e" />

<img width="480" height="320" alt="camera demo" src="https://github.com/user-attachments/assets/55658444-b571-4b5a-8fdc-7938f391f6f7" />

## Entity

### Creating entity

**x**: `number` - entity x position\
**y**: `number` - entity y position\

```js
import {Entity, Sprite} from "/wee.es.js";

class Bullet extends Entity {
    constructor(x, y) {
        super(x, y);
    }
}
```

### Stage instance

Entity has access to its stage instance, after being added;

```js
class Chicken extends Entity {
    constructor() {
        super();
        this.stage // null
    }

    // entity added and updates by stage
    update() {
        this.stage // myStage instance
    }
}
```

### Update function

```js
import {Entity} from "/wee.es.js";

class Bullet extends Entity {

    direction = 0;

    constructor(x, y, direction) {
        super(x, y);
        this.direction = direction;
    }

    update() {
        const speed = 200 * this.delta; //this.delta is shortcut to this.stage.game.delta
        this.x += speed * this.direction;
    }
}
```

### Render order

**z**: `number` - define rendering order. Entities with lower z - renders first.

```js
// chicken sprite will be rendered over cow sprite
chicken.z = 20;
cow.z = 10;
```

### Hitbox

**width**: `number` - hitbox width\
**height**: `number` - hitbox height\
**originX**: `number` - hitbox horizontal offset, default - `0`\
**originY**: `number` - hitbox vertical offset, default - `0` \
**group**: `string` - collision group name. Use different groups to separate kinds of hitboxes (e.g. "player", "wall",
"projectile").

```js
// make hitbox 20 by 10 pixels
bullet.width = 20;
bullet.height = 10;

// default hitbox offset is (0, 0) - entity position
// move hitbox to entity center
bullet.originX = -bullet.width / 2;
bullet.originY = -bullet.height / 2;

// bullet is a part of projectiles group
bullet.group = "projectile"
```

### Collision handling and Collision group

**collide (group: string, offsetX: number, offsetY: number):Entity[]**  - check for collision with a specific
group, returns array of collided entities (can be empty);

```js
/** in chicken update function */
const projectiles = this.collide('projectile', 0, 0);

//chicken get shot!
if (projectiles.length > 0) {
    const firstProjectile = projectiles.shift();
    this.stage.remove(firstProjectile) // remove first projectile that hit chicken
    this.health -= 10; // damage
}

```

```js
/** in chicken update function */
const speed = 50 * this.delta;
const direction = {x: 1, y: 0};

// position entity will be next frame
const nextX = direction.x * speed;
const nextY = direction.y * speed;

const wall = this.collide('wall', nextX, nextY);

// there is no wall on the way, we can move there
if (wall.length === 0) {
    this.x += nextX;
    this.y += nextY;
} 
```

**collideWith (e: Entity, offsetX: number, offsetY: number):boolean**  - check for collision with specific entity

```js
const cow = new Cow(0, 0);
```

```js
/** in chicken update function */

if (this.collideWith(cow, 0, 0)) {
    // chicken collided with specific cow
}
```

**collidePoint (x:number, y:number):boolean** - check if point is in hitbox

```js
const screenCenter = {
    x: this.game.width / 2 - this.stage.camera.x,
    y: this.game.height / 2 - this.stage.camera.y,
}

if (this.collidePoint(screenCenter.x, screenCenter.y)) console.log('chicken is in center of game screen');
```

## Sprite

### Creating sprite

If asset represent single sprite

**asset**: `string` - asset name\
**width**: `number` - width of single sprite frame\
**height**: `number` - height of single sprite frame

```js
import {Asset, Sprite} from "/wee.es.js";

await Asset.load({name: 'CHICKEN', path: "./chicken.png", type: "image"});

chicken.sprite = new Sprite('CHICKEN', 16, 16);
```

<img width="403" height="220" alt="chicken.png" src="https://github.com/user-attachments/assets/4502d9c9-bad8-453d-8690-3685716d3359" />

### Shared spritesheet

Sometimes you need to use only some part of asset

**x**: `number` - position `x` of cut out rectangle \
**y**: `number` - position `y` of cut out rectangle \
**cropWidth**: `number` -  `width` cut out rectangle \
**cropHeight**: `number` - `height` cut out rectangle

```js
import {Asset, Sprite} from "/wee.es.js";

await Asset.load({name: 'FURNITURE', path: "./furniture.png", type: "image"});

// 
chair.sprite = new Sprite('FURNITURE', 16, 16, 64, 32, 64, 16); 
```

<img width="576" height="384" alt="furniture.png" src="https://github.com/user-attachments/assets/96efd39e-ee7f-4370-a07c-6ba32a47eea7" />

### Animation

`play (animation: number[], speed:number, force:boolean)` - play animation

**animation**: `number[]` - frame sequence \
**speed**: `number` - animation speed (frames per sec)\
**force**: `boolean` - should animation restart if it's already playing

```js
const IDLE = [0, 0, 0, 1];
const RUN = [4, 5, 6, 7];

chicken.sprite.play(IDLE, 4); // chicken is blinking

// somewhere later in code
chicken.sprite.play(RUN, 12); // chicken is running
```

<img width="256" height="130" alt="chicken.png" src="https://github.com/user-attachments/assets/b7a5c601-2969-4b73-a925-3d36d8d69c62" />

### Pattern

You can fill sprite with texture

**fillWidth**: `number` - `width` of filling rectangle \
**fillHeight**: `number` - `height` of filling rectangle

```js
await Asset.load({name: 'WATER', path: "./water.png", type: "image"});

const water = new Sprite('WATER', 16, 16);

// fill screen with water texture
water.fillWidth = this.game.width;
water.fillHeight = this.game.height;

stage.addSprite(water);
```

### Animated patterns

```js
// fill screen with water texture
water.fillWidth = this.game.width;
water.fillHeight = this.game.height;

// play flow animation
water.play([0, 1, 2], 12);
```

### Transformations

Pivot - point on sprite around which sprite transforms \
**pivotX**:`number` - transformation pivot point X position \
**pivotY**:`number` - transformation pivot point Y position \
**scale**:`number` - overall scale factor. Default = 1. \
**scaleX**:`number` - horizontal scale, applies over `scale`. Default = 1. \
**scaleY**:`number` - vertical scale, applies over `scale`. Default = 1. \
**rotation**:`number` - tilt of a sprite in degrees. Default = 0. \
**alpha**:`number` - Sprite opacity from 0 (transparent) to 1 (100% opaque). Default = 1.

```js
const flower = new Sprite('FLOWER', 16, 32);

// move pivot to base of the flower trunk
flower.pivotX = 8;
flower.pivotY = 32;

flower.rotation = 45; //flower rotates by 45 degrees clockwise

flower.scale = 0.5 // half of original size
flower.scaleX = 6 // six times wider
flower.scaleY = 4 // four times taller
// Now flower is x3 wider and x2 taller of original size
```

## Input

### Keyboard

`Input.pressed(code:string):boolean` - return true if key was pressed this frame
`Input.down(code:string):boolean` - return true if key is held down
`Input.released(code:string):boolean` - return true if key was released this frame

```js
if (Input.pressed('Space')) console.log('SPACEBAR was pressed')
if (Input.down('Space')) console.log('SPACEBAR is held down')
if (Input.released('Space')) console.log('SPACEBAR was released')
```

```terminaloutput
SPACEBAR was pressed 
SPACEBAR is held down x69
SPACEBAR was released
```

### Mouse

`Input.mouse.left`, `Input.mouse.right`, `Input.mouse.middle` - objects that contains mouse buttons state

```js
if (Input.mouse.left.pressed) console.log('LMB is pressed');
if (Input.mouse.right.down) console.log('RMB is held down');
if (Input.mouse.middle.released) console.log('MMB is released');
```

`Input.mouse.x` and `Input.mouse.y` - mouse cursor position on the game canvas.

```js
const chicken = new Chicken();

const inGameMouse = {
    x: Input.mouse.x - this.stage.camera.x,
    y: Input.mouse.y - this.stage.camera.y,
}
const isHover = chicken.collidePoint(inGameMouse.x, inGameMouse.y);
if (isHover && Input.mouse.left.pressed) console.log('You clicked on chicken!');
```

`Input.mouse.wheel` - travel of mouse wheel in this frame

```js
if (Input.mouse.wheel > 0) console.log('scroll down')
if (Input.mouse.wheel < 0) console.log('scroll up')
```

## Sound

### Browser autoplay policy

Modern browsers block AudioContext until the user interacts with the page.

### Creating Sound

```js
import {Sound} from "/wee.es.js";

await Asset.load({name: 'BOOM_SFX', path: '/assets/boom.mp3', type: "audio"});

const sfx = new Sound("BOOM_SFX");
```

### Play

`play(force:boolean, loop:boolean)` - play sound; \
**force**: `boolean` - should sound restart if already playing \
**loop**: `boolean` - should sound start again after is ended

```js
/** before user interaction*/
sfx.play(); // nothing happened

if (Input.pressed('Space')) sfx.play(); // sound played

/** after user interaction*/
sfx.play(); // works fine because user interacted with page
```

### Stop

`stop()` - Stop playback immediately.

### Volume

**volume**: `number` - sound loudness. From 0 to 1

```js
sfx.volume = .5 // half of max loudness
```

### Stereo panning

**pan**: `number` - sound position. From -1 (full left) to 1 (full right). Default = 0 (center)

```js

sfx.play();
sfx.pan = -1;

update() {
    if (sfx.pan < 1) sfx.pan += this.delta; // sound will move from left to right
}
```

### Duration and position

**duration**: `number` - audio duration in seconds \
**position**: `number` - current playback position in seconds

## Credits

Beautiful sprite set used in examples is [Sprout Lands](https://cupnooble.itch.io/sprout-lands-asset-pack) made
by [CUPNOOBLE](https://cupnooble.itch.io/)

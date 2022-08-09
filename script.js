"use strict";
import { assertNotNull, assertInstancesOf, assertWithinRange, getNewElement, crash, assertDifferentObjects, count, assertIncludes, objIncludes } from './lib/Util.js';
import { Vector2, vector2 } from './lib/Vector2.js';
import { Rect2, rect2 } from './lib/Rect2.js';
import { Color, color } from './lib/Color.js';
import { GameObj } from './lib/GameObj.js';
import { gameArea, gameContainer } from './lib/Game.js';
import * as Physics from './lib/Physics.js';
import { subscribeToBtnClicks } from './lib/GameBtn.js';
import { GameMenu } from './lib/GameMenu.js';
import { GameLabel } from './lib/GameLabel.js';

/**@param {HTMLElement} btn - GameBtn element */
const gameBtnClickListener = (btn) => {
    const btnText = btn.textContent;
    if (objIncludes(btnText, DIFFICULTY)) {
        setDifficulty(btnText);
        startGame();
    }
}

subscribeToBtnClicks(gameBtnClickListener);

const FPS = 60;
const tickRate = (1.0 / FPS) * 1000;
const GRAVITY = 1;
const JUMP_FORCE = -8;

const WALL_WIDTH = 16;
const HOLE_HEIGHT = 85; // height of gap between walls
const WALL_SPAWN_X_POS = gameArea.getX + WALL_WIDTH;

const FLOOR_HEIGHT = 2;
const CEILING_HEIGHT = FLOOR_HEIGHT;

const PLAYER_START_POS = vector2(4, 64);
const PLAYER_PIXEL_OUTLINE_THICKNESS = 1; // 1 pixel black outline
const PLAYER_IMAGE_PATH = "./images/FloppyDisk.png"

const DIFFICULTY = {
    Easy: "Easy",
    Medium: "Medium",
    Hard: "Hard",
    Insane: "Insane",
}

let currentDifficulty = DIFFICULTY.Easy;
let wallSpeed = -8; // wall movement speed
let isFloorLethal = true;
let isCeilingLethal = true;
let physicsInterval;
let score = 0;


// --- assigned in initializeVars(); ---
let mainMenu;
let player;
let floor;
let ceiling;
let topWall;
let bottomWall;
let walls;
let scoreLabel;
// -------------------------------------

const initializeVars = () => {
    mainMenu = new GameMenu(
        {
            id: "main-menu",
            title: "DIFFICULTY",
            btnStrings: [...Object.values(DIFFICULTY)],
        }
    );

    setMainMenuVisible(false);

    player = new GameObj(
        {
            id: "player",
            rect2: rect2(PLAYER_START_POS, vector2(16, 16)),
            imgSrc: PLAYER_IMAGE_PATH,
            backgroundColor: Color.WHITE,
        }
    );

    floor = getNewFloorOrCeiling("floor");
    ceiling = getNewFloorOrCeiling("ceiling");
    topWall = getNewWall("top-wall");
    bottomWall = getNewWall("bottom-wall");
    walls = [topWall, bottomWall];

    scoreLabel = new GameLabel(
        {
            id: "score-counter",
            classList: ["absolute", "text-only", "bottom", "left"],
            text: "score: 0",
            rect2: rect2(Vector2.ZERO, gameArea),
        }
    );

    const gameObjects = [ceiling, floor, topWall, bottomWall, player, mainMenu, scoreLabel];

    gameObjects.forEach(obj => {
        obj.addToGame();
    })

    bottomWall.setY = bottomWall.getMaxY;

    walls.forEach(wall => {
        wall.setX = WALL_SPAWN_X_POS;
    })

    window.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (isMainMenuVisible()) {
                switch (event.key) {
                    case "ArrowUp":
                    case "w":
                        mainMenu.offsetFocusedBtnIndex(-1);
                        break;
                    case "ArrowDown":
                    case "s":
                        mainMenu.offsetFocusedBtnIndex(1);
                        break;
                    case "Enter":
                        mainMenu.getFocusedBtn.click();
                        break;
                }
            } else {
                if (event.key == " ") {
                    player.setVelocity = vector2(0, JUMP_FORCE);
                }
            }
        }

    })
}

const isMainMenuVisible = () => {
    return mainMenu.getElement.style.display != "none";
}

const setMainMenuVisible = (bool) => {
    mainMenu.getElement.style.display = bool ? "grid" : "none";
    if (bool) {
        mainMenu.setFocusedBtnIndex = mainMenu.getFocusedBtnIndex;
    }
}

const endGame = (message) => {
    clearInterval(physicsInterval);
    setMainMenuVisible(true);
}

const tick = () => {
    applyGravity();
    moveWalls();
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        if (wall.touches(player)) {
            endGame("Collided with wall. Game Over.");
            break;
        }
    }
}


/** 
 * @param {string} wallID
 * @return {GameObj} get a Wall GameObj 
 * 
*/
const getNewWall = (wallID) => {
    return new GameObj(
        {
            id: wallID,
            rect2: rect2(Vector2.ZERO, vector2(WALL_WIDTH, (gameArea.getY - HOLE_HEIGHT) / 2.0)),
            backgroundColor: Color.RED,
        });
}

/** 
 * @param {string} ceilingOrFloorID
 * @return {GameObj} Get a new Floor or Ceiling GameObj
*/
const getNewFloorOrCeiling = (ceilingOrFloorID) => {
    if (!["floor", "ceiling"].includes(ceilingOrFloorID)) { crash("Invalid id", ceilingOrFloorID); }

    const obj = new GameObj(
        {
            id: ceilingOrFloorID,
            rect2: rect2(Vector2.ZERO, vector2(gameArea.getX, FLOOR_HEIGHT)),
            backgroundColor: Color.RED,
        });

    if (ceilingOrFloorID == "floor") {
        obj.setY = obj.getMaxY;
    }

    return obj;
}



const setDifficulty = (difficulty) => {
    assertIncludes(difficulty, DIFFICULTY);

    const setLethalityAndWallSpeed = (_isFloorLethal, _isCeilingLethal, speed) => {
        isFloorLethal = _isFloorLethal;
        isCeilingLethal = _isCeilingLethal;
        wallSpeed = speed;

        floor.getElement.style.display = _isFloorLethal ? "inline-block" : "none";
        ceiling.getElement.style.display = _isCeilingLethal ? "inline-block" : "none";
    }

    switch (difficulty) {
        case DIFFICULTY.Easy:
            setLethalityAndWallSpeed(false, false, -4);
            break;
        case DIFFICULTY.Medium:
            setLethalityAndWallSpeed(false, true, -6);
            break;
        case DIFFICULTY.Hard:
            setLethalityAndWallSpeed(true, true, -8);
            break;
        case DIFFICULTY.Insane:
            setLethalityAndWallSpeed(true, true, -10);
            break;
        default:
            crash("Invalid case", difficulty);
    }

    currentDifficulty = difficulty;
}

const updateScoreLabel = () => {
    scoreLabel.getElement.textContent = `score: ${score}`;
}


const moveWalls = () => { // move walls toward the left edge of the screen, then reset position when offscreen
    let shouldPosReset = false;
    walls.forEach(wall => {
        if (wall.getX <= -WALL_WIDTH) { // if wall offscreen (left side)
            wall.setX = WALL_SPAWN_X_POS // move wall offscreen (right side)
            shouldPosReset = true;
        } else {
            wall.offsetPos(vector2(wallSpeed, 0));
        }
    })

    if (shouldPosReset) {
        change_hole_pos();
        score += 1;
        updateScoreLabel();
    }
}

const change_hole_pos = () => {
    const MIN_WALL_HEIGHT = 8;
    const SPACER = PLAYER_PIXEL_OUTLINE_THICKNESS + 1; // offscreen padding for disabled walls to prevent collision
    const randomInt = Math.floor(Math.random() * 5000);
    let holeTop = randomInt % (gameArea.getY - HOLE_HEIGHT + 1);

    if (holeTop < MIN_WALL_HEIGHT) { // disable top wall
        holeTop = -PLAYER_PIXEL_OUTLINE_THICKNESS - 1;
        holeTop = -SPACER;
        topWall.setHeight = 0;
        topWall.setY = holeTop;
    } else {
        topWall.setHeight = holeTop;
        topWall.setY = 0;
    }

    let holeBottom = holeTop + HOLE_HEIGHT;
    const testBottomWallHeight = gameArea.getY - holeBottom;

    if (testBottomWallHeight < MIN_WALL_HEIGHT) { // disable bottom wall
        holeBottom = SPACER;
        bottomWall.setHeight = 0;
    } else {
        bottomWall.setHeight = testBottomWallHeight;
    }

    bottomWall.setY = holeBottom;
}



const applyGravity = () => {
    player.offsetVelocity(vector2(0, GRAVITY));
    player.offsetPos(player.getVelocity);

    let minY = isCeilingLethal ? CEILING_HEIGHT : 0;
    let maxY = isFloorLethal ? player.getMaxY - FLOOR_HEIGHT : player.getMaxY;

    minY -= PLAYER_PIXEL_OUTLINE_THICKNESS;
    maxY += PLAYER_PIXEL_OUTLINE_THICKNESS;
    /* Looks better if the outline overlaps floor/ceiling during collision.
        Otherwise, with a black background, it doesn't look like the player is actually touching the floor/ceiling.
    */

    if (player.getY >= maxY) {
        player.setVelocity = Vector2.ZERO;
        player.setY = maxY;
        if (isFloorLethal) {
            endGame("Collided with floor. Game Over.");
        }
    } else if (player.getY <= minY) {
        player.setVelocity = Vector2.ZERO;
        player.setY = minY;
        if (isCeilingLethal) {
            endGame("Collided with ceiling. Game Over.");
        }
    }
}

const updateScaling = () => {
    const widthToHeightRatio = 0.5625 //  (native resolution: 320x180 -- 16:9) (9/16 = 0.5625)
    const heightToWidthRatio = 1.7778; // (16/9)
    let xScale = window.innerWidth / gameArea.getX;
    let scaledWidth = gameArea.getX * xScale;
    const scaledHeight = scaledWidth * widthToHeightRatio;
    if (window.innerHeight < scaledHeight) {
        scaledWidth = window.innerHeight * heightToWidthRatio;
        xScale = scaledWidth / 320;
    }

    const paddingMultiplier = 1.0; // 1.0 = max width/height (maintaining aspect ratio), < 1.0 = padding
    gameContainer.style.transform = `scale(${xScale * paddingMultiplier})`
}

const startGame = () => {
    score = 0;
    updateScoreLabel();
    setMainMenuVisible(false);

    if (walls.length) {
        walls.forEach(wall => {
            wall.setX = WALL_SPAWN_X_POS;
        })
    }

    if (player) {
        player.setPos = PLAYER_START_POS;
    }

    setTimeout(() => {
        player.setVelocity = Vector2.ZERO;
        physicsInterval = setInterval(tick, tickRate); // set tick interveral
    }, 1000); // wait a second for scripts to load

}

window.onresize = () => {
    updateScaling();
}

window.onload = () => {
    initializeVars();
    updateScaling();
    setDifficulty(currentDifficulty);
    startGame();
}
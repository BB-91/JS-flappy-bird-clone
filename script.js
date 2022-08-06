"use strict";
import { assertNotNull, assertInstancesOf, assertWithinRange, getNewElement, crash, assertDifferentObjects, count, assertIncludes, objIncludes } from './lib/Util.js';
import { Vector2, vector2 } from './lib/Vector2.js';
import { Rect2, rect2 } from './lib/Rect2.js';
import { Color, color } from './lib/Color.js';
import { GameObj } from './lib/GameObj.js';
import { gameArea, gameContainer } from './lib/Game.js';
import * as Physics from './lib/Physics.js';
import { createMenu, subscribeToBtnClicks } from './lib/GameBtn.js';

/**@param {HTMLElement} btn - GameBtn element */
const gameBtnClickListener = (btn) => {
    console.log("recieved notification of btn click!", btn);
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

const mainMenu = createMenu("DIFFICULTY", ...Object.values(DIFFICULTY));

const setMainMenuVisible = (bool) => {
    mainMenu.style.display = bool ? "grid" : "none";
}

let physicsInterval;

const player = new GameObj({ rect2: rect2(PLAYER_START_POS, vector2(16, 16)), backgroundColor: Color.WHITE })

const endGame = (message) => {
    clearInterval(physicsInterval);
    setMainMenuVisible(true);
    console.log(message);
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


/** @return {GameObj} get a Wall GameObj */
const getNewWall = () => {
    return new GameObj(
        { 
            rect2: rect2(Vector2.ZERO, vector2(WALL_WIDTH, (gameArea.getY - HOLE_HEIGHT) / 2.0)),
            backgroundColor: Color.RED,
        });
    }

/** 
 * @param {boolean} isFloorObj
 * @return {GameObj} Get a new Floor or Ceiling GameObj
*/
const getNewFloorOrCeiling = (isFloorObj) => {
    const obj = new GameObj(
        { 
            rect2: rect2(Vector2.ZERO, vector2(gameArea.getX, FLOOR_HEIGHT)),
            backgroundColor: Color.RED,
        });


    if (isFloorObj) {
        obj.setY = obj.getMaxY;
    }

    return obj;
}

const floor = getNewFloorOrCeiling(true);
const ceiling = getNewFloorOrCeiling(false);
const topWall = getNewWall();
const bottomWall = getNewWall();
const walls = [topWall, bottomWall];


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
    }
}

const change_hole_pos = () => {
    const randomInt = Math.floor(Math.random() * 5000);
    const holeTop = randomInt % (gameArea.getY - HOLE_HEIGHT + 1);
    const holeBottom = holeTop + HOLE_HEIGHT;
    topWall.setHeight = holeTop;
    bottomWall.setY = holeBottom;
    bottomWall.setHeight = (gameArea.getY - holeBottom);
}


[player, ceiling, floor, topWall, bottomWall].forEach(obj => {
    obj.addToGame();
})

bottomWall.setY = bottomWall.getMaxY;

walls.forEach(wall => {
    wall.setX = WALL_SPAWN_X_POS;
})

const applyGravity = () => {
    player.offsetVelocity(vector2(0, GRAVITY));
    player.offsetPos(player.getVelocity);

    const minY = isCeilingLethal ? CEILING_HEIGHT : 0;
    const maxY = isFloorLethal ? player.getMaxY - FLOOR_HEIGHT : player.getMaxY;

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

window.addEventListener("keydown", (event) => {
    if (event.key == " " && !event.repeat){ // spacebar
        player.setVelocity = vector2(0, JUMP_FORCE)
    }
})

const updateScaling = () => {
    const widthToHeightRatio = 0.5625 //  (native resolution: 320x180 -- 16:9) (9/16 = 0.5625)
    const heightToWidthRatio = 1.7778; // (16/9)
    let xScale = window.innerWidth/gameArea.getX;
    let scaledWidth = gameArea.getX * xScale;
    const scaledHeight = scaledWidth * widthToHeightRatio;
    if (window.innerHeight < scaledHeight) {
        scaledWidth = window.innerHeight * heightToWidthRatio;
        xScale = scaledWidth / 320;
    }

    const paddingMultiplier = 1.0; // 1.0 = max width/height (maintaining aspect ratio), < 1.0 = padding
    gameContainer.style.transform = `scale(${xScale * paddingMultiplier})`
    console.log(`gameContainer.style.transform:`, gameContainer.style.transform);
    console.log(`parseFloat(gameContainer.style.transform):`, parseFloat(gameContainer.style.transform));
}

window.onresize = () => {
    updateScaling();
}

const startGame = () => {
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


setMainMenuVisible(false);
gameContainer.appendChild(mainMenu);


window.onload = () => {
    updateScaling();
    setDifficulty(currentDifficulty);
    startGame();
}
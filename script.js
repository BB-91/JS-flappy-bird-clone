"use strict";
import { assertNotNull, assertInstancesOf, assertWithinRange, getNewElement, crash } from './lib/Util.js';
import { Vector2, vector2 } from './lib/Vector2.js';
import { Rect2, rect2 } from './lib/Rect2.js';
import { Color, color } from './lib/Color.js';
import { GameObj } from './lib/GameObj.js';
import { gameArea } from './lib/Game.js';

const FPS = 60;
const tickRate = (1.0 / FPS) * 1000;
const GRAVITY = 1;
const JUMP_FORCE = -10;
const tick = () => {
    applyGravity();
    moveWalls();
}
let physicsInterval;
// clearInterval(physicsInterval);

const WALL_WIDTH = 16
const WALL_SPEED = -5 // wall movement speed
const HOLE_HEIGHT = 85 // height of gap between walls

const playerGameObj = new GameObj({ rect2: rect2(Vector2.ZERO, vector2(16, 16)), backgroundColor: Color.WHITE })

const getNewWall = () => {
    return new GameObj(
        { 
            rect2: rect2(Vector2.ZERO, vector2(WALL_WIDTH, (gameArea.getY - HOLE_HEIGHT) / 2.0)),
            backgroundColor: Color.RED,
        });
    }

const moveWalls = () => { // move walls toward the left edge of the screen, then reset position when offscreen
    let shouldPosReset = false;
    walls.forEach(wall => {
        if (wall.getX <= -WALL_WIDTH) { // if wall offscreen (left side)
            wall.setX = gameArea.getX + WALL_WIDTH // move wall offscreen (right side)
            shouldPosReset = true;
        } else {
            wall.offsetPos(vector2(WALL_SPEED, 0));
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

const topWall = getNewWall();
const bottomWall = getNewWall();
const walls = [topWall, bottomWall];

[playerGameObj, topWall, bottomWall].forEach(obj => {obj.addToGame();})

bottomWall.setY = bottomWall.getMaxY;
walls.forEach(wall => {wall.setX = 40;})

const applyGravity = () => {
    playerGameObj.offsetVelocity(vector2(0, GRAVITY));
    playerGameObj.offsetPos(playerGameObj.getVelocity);

    if (playerGameObj.getY > playerGameObj.getMaxY) {
        playerGameObj.setVelocity = Vector2.ZERO;
        playerGameObj.setY = playerGameObj.getMaxY;
    } else if (playerGameObj.getY < 0) {
        playerGameObj.setVelocity = Vector2.ZERO;
        playerGameObj.setY = 0;
    }
}

/**
 * Check if rectA contains rectB.
 * @param {Rect2} a - rectA
 * @param {Rect2} b - rectB
 */
 const contains = (a, b) => {
	return (
		a.getLeft < b.getLeft &&
		a.getTop < b.getTop &&
		a.getRight > b.getRight &&
		a.getBottom > b.getBottom
	);
}


/**
 * Check if rectA overlaps rectB.
 * @param {Rect2} a - rectA
 * @param {Rect2} b - rectB
 */
const overlaps = (a, b) => {
	if (a.getLeft >= b.getRight || b.getLeft >= a.getRight) {return false;} // no horizontal overlap
	if (a.getTop >= b.getBottom || b.getTop >= a.getBottom) {return false;} // no vertical overlap
	return true;
}


window.addEventListener("keydown", (event) => {
    if (event.key == " " && !event.repeat){ // spacebar
        playerGameObj.setVelocity = vector2(0, JUMP_FORCE)
    }
})


window.onload = () => {
    setTimeout(() => {
        physicsInterval = setInterval(tick, tickRate); // set tick interveral
    }, 1000); // wait a second for scripts to load
}
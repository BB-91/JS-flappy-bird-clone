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
const tick = () => {applyGravity();}
let physicsInterval;
// clearInterval(physicsInterval);

const WALL_WIDTH = 16
const WALL_SPEED = -20 // wall movement speed
const HOLE_HEIGHT = 85 // height of gap between walls

const playerGameObj = new GameObj({ rect2: rect2(Vector2.ZERO, vector2(16, 16)), backgroundColor: Color.WHITE })

const getNewWall = () => {
    return new GameObj(
        { 
            rect2: rect2(Vector2.ZERO, vector2(WALL_WIDTH, (gameArea.getY - HOLE_HEIGHT) / 2.0)),
            backgroundColor: Color.RED,
        });
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
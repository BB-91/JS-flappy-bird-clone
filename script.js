"use strict";
import { assertNotNull, assertInstancesOf, assertWithinRange, getNewElement, crash } from './lib/Util.js';
// import { Vector2, Vec } from './lib/Vector2.js';
import { Vector2, vector2 } from './lib/Vector2.js';
import { Rect2 } from './lib/Rect2.js';
import { GameObj } from './lib/GameObj.js';
import { Color } from './lib/Color.js';

const gameContainer = document.querySelector("game-container");
const gameContainerStyle = getComputedStyle(gameContainer);
const gameArea = new Vector2(
    parseInt(gameContainerStyle.width),
    parseInt(gameContainerStyle.height),
)

const playerGameObj = new GameObj(
    {
        rect2: new Rect2(Vector2.ZERO, new Vector2(16, 16)),
        backgroundColor: Color.WHITE,
    })

playerGameObj.addToGame();

const GRAVITY = 10;
const tick = () => {applyGravity();}
let physicsInterval;

const applyGravity = () => {
    playerGameObj.offsetPos(vector2(0, GRAVITY));
    const playerMaxY = gameArea.getY - playerGameObj.getHeight;

    if (playerGameObj.getY > playerMaxY) {
        playerGameObj.setY = playerMaxY;
        console.log("stopping interval")
        clearInterval(physicsInterval);
    }
}

window.onload = () => {
    setTimeout(() => {
        // 60 FPS = 1.0/60.0
        physicsInterval = setInterval(tick, 100); // set tick interveral
    }, 1000); // wait a second for scripts to load
}
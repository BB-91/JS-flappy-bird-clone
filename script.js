"use strict";
import { assertNotNull, assertInstancesOf, assertWithinRange, getNewElement, crash } from './lib/Util.js';
// import { Vector2, Vec } from './lib/Vector2.js';
import { Vector2, vector2 } from './lib/Vector2.js';
import { Rect2 } from './lib/Rect2.js';
import { GameObj } from './lib/GameObj.js';
import { Color } from './lib/Color.js';

const gameContainer = document.querySelector("game-container");
const gameContainerStyle = getComputedStyle(gameContainer);
const gameArea = vector2(parseInt(gameContainerStyle.width), parseInt(gameContainerStyle.height))
const FPS = 60;
const tickRate = (1.0 / FPS) * 1000;
const GRAVITY = 1;
const JUMP_FORCE = -13
const tick = () => {applyGravity();}
let physicsInterval;
// clearInterval(physicsInterval);

const playerGameObj = new GameObj(
    {
        rect2: new Rect2(Vector2.ZERO, new Vector2(16, 16)),
        backgroundColor: Color.RED,
    })

playerGameObj.addToGame();

const applyGravity = () => {
    playerGameObj.offsetVelocity(vector2(0, GRAVITY));
    playerGameObj.offsetPos(playerGameObj.getVelocity);

    const playerMaxY = gameArea.getY - playerGameObj.getHeight;

    if (playerGameObj.getY > playerMaxY) {
        playerGameObj.setVelocity = Vector2.ZERO;
        playerGameObj.setY = playerMaxY;
    } else if (playerGameObj.getY < 0) {
        playerGameObj.setVelocity = Vector2.ZERO;
        playerGameObj.setY = 0;
    }
}

window.addEventListener("keydown", (event) => {
    if (event.key == " " && !event.repeat){ // spacebar
        console.log("pressed spacebar.");
        playerGameObj.setVelocity = vector2(0, JUMP_FORCE)
    }
})

window.onload = () => {
    setTimeout(() => {
        physicsInterval = setInterval(tick, tickRate); // set tick interveral
    }, 1000); // wait a second for scripts to load
}
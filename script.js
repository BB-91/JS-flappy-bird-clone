"use strict";
import { assertNotNull, assertInstancesOf, assertWithinRange, getNewElement } from './lib/Util.js';
import { Vector2 } from './lib/Vector2.js';
import { Rect2 } from './lib/Rect2.js';
import { GameObj } from './lib/GameObj.js';
import { Color } from './lib/Color.js';

const gameContainer = document.querySelector("game-container");

const playerGameObj = new GameObj(
    {
        rect2: new Rect2(Vector2.ZERO, new Vector2(16, 16)),
        backgroundColor: Color.WHITE,
    })

playerGameObj.addToGame();

playerGameObj.setX = 20;
playerGameObj.setY = 30;
playerGameObj.setPos = new Vector2(40, 60);

const getPos = (element) => {
    if (!element) {crash(`Error: ${element}`);}
    if (!element instanceof HTMLElement) {crash(`Not an HTMLElement: ${element}`)}
    return element.style.position;
}


const GRAVITY = 1;

// 60 FPS = 1.0/60.0

// const tick = () => {
//     console.log("tick");
// }

// window.onload = () => {
//     setInterval(() => {
//         tick();
//     }, 1000);
// }
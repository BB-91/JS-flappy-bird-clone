"use strict";
import { countdownToGameStart, handleMenuNavigation, initializeGUI,
            isCountdownLabelVisible, isMainMenuVisible, isNavKey, setMainMenuVisible } from './GUI.js';
import { initializeObstacles, moveWalls, setObstacleDifficulty } from './Obstacles.js';
import { applyPlayerGravity, initializePlayer, jump } from './Player.js';
import { playImpactSound } from './SamplePlayer.js';
import { assertIncludes } from './Util.js';
import { vector2 } from './Vector2.js';

const gameContainer = document.querySelector("game-container");
const gameContainerStyle = getComputedStyle(gameContainer);
const gameArea = vector2(parseInt(gameContainerStyle.width), parseInt(gameContainerStyle.height))
const FPS = 60;
const tickRate = (1.0 / FPS) * 1000;
let physicsInterval;

const DIFFICULTY = {
    Easy: "Easy",
    Medium: "Medium",
    Hard: "Hard",
    Insane: "Insane",
}

let currentDifficulty = DIFFICULTY.Easy;

const setDifficulty = (difficulty) => {
    assertIncludes(difficulty, DIFFICULTY);
    setObstacleDifficulty(difficulty);
    currentDifficulty = difficulty;
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

const tick = () => {
    applyPlayerGravity();
    moveWalls();
}


const startGame = () => {
    physicsInterval = setInterval(tick, tickRate); // set tick interveral
}

const endGame = () => {
    playImpactSound();
    clearInterval(physicsInterval);
    setMainMenuVisible(true);
}

window.onresize = () => {
    updateScaling();
}

window.addEventListener("keydown", (event) => {
    const keyName = event.key;

    if (!event.repeat) {
        if (isMainMenuVisible() && isNavKey(keyName)) {
            handleMenuNavigation(keyName);
        } else if (!isCountdownLabelVisible()){
            if (keyName == " ") { // spacebar
                jump();
            }
        }
    }
})

const setup = () => {
    initializeObstacles();
    initializePlayer();
    initializeGUI();
    updateScaling();
    setDifficulty(currentDifficulty);
    countdownToGameStart();
}


export {  gameContainer, gameArea, DIFFICULTY, updateScaling, startGame, endGame, setDifficulty, setup };
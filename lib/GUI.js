"use strict";
import { DIFFICULTY, gameArea, setDifficulty, startGame } from "./Game.js";
import { subscribeToBtnClicks } from "./GameBtn.js";
import { GameLabel } from "./GameLabel.js";
import { GameMenu } from "./GameMenu.js";
import { resetWallsPosition } from "./Obstacles.js";
import { resetPlayerPosition } from "./Player.js";
import { rect2 } from "./Rect2.js";
import { assertIncludes, assertNotNull, assertWithinRange, objIncludes } from "./Util.js";
import { vector2, Vector2 } from "./Vector2.js";


let score = 0;
let mainMenu;
let scoreLabel;
let countdownLabel;
let countdownInterval;
const MAX_COUNTDOWN_VALUE = 3;
let countDownValue = MAX_COUNTDOWN_VALUE;

const updateScoreLabel = () => {
    scoreLabel.getElement.textContent = `score: ${score}`;
    
}

const updateCountdownLabel = () => {
    countdownLabel.getElement.textContent = `${countDownValue}`;
}

const setCursorVisible = (bool) => {
    const body = document.querySelector("body");
    if (bool) {
        body.classList.remove("no-cursor");
    } else {
        body.classList.add("no-cursor");
    }

    window.dispatchEvent(new Event("mousemove")) // force cursor visibility to update
}

/**
 * @param {GameObj} gameObj - GameObj with element container using style "display: grid"
 * @param {boolean} bool - true: "display: grid" --- false: "display: none"
*/
const setGridElementVisibility = (gameObj, bool) => {
    assertNotNull(gameObj);
    const gridElement = gameObj.getElement;
    assertNotNull(gridElement);
    gridElement.style.display = bool ? "grid" : "none";
}

/**
 * @param {GameObj} gameObj - check if GameObj element style has "display: none"
*/
const isElementHidden = (gameObj) => {
    return gameObj.getElement.style.display == "none";
}

const isCountdownLabelVisible = () => {
    return !isElementHidden(countdownLabel);
}

const isMainMenuVisible = () => {
    return !isElementHidden(mainMenu);
}

const setCountdownLabelVisible = (bool) => {
    setGridElementVisibility(countdownLabel, bool);
}

const setMainMenuVisible = (bool) => {
    setCursorVisible(bool);
    setGridElementVisibility(mainMenu, bool);
    if (bool) {
        mainMenu.setFocusedBtnIndex = mainMenu.getFocusedBtnIndex;
    }
}



const updateCountdown = () => {
    countDownValue--;
    updateCountdownLabel();
    if (countDownValue <= 0) {
        setCountdownLabelVisible(false);
        clearInterval(countdownInterval);
        countDownValue = MAX_COUNTDOWN_VALUE;
        startGame();
    }
}


const countdownToGameStart = () => {
    score = 0;
    updateScoreLabel();
    setMainMenuVisible(false);

    resetWallsPosition();
    resetPlayerPosition();

    assertWithinRange(0, 5, MAX_COUNTDOWN_VALUE);
    countDownValue = MAX_COUNTDOWN_VALUE;
    updateCountdownLabel();
    setCountdownLabelVisible(true);
    countdownInterval = setInterval(updateCountdown, 500);
}


const initializeGUI = () => {
    mainMenu = new GameMenu(
        {
            id: "main-menu",
            title: "DIFFICULTY",
            btnStrings: [...Object.values(DIFFICULTY)],
        }
    );

    scoreLabel = new GameLabel(
        {
            id: "score-label",
            classList: ["absolute", "text-only", "bottom", "right"],
            text: "score: 0",
            rect2: rect2(Vector2.ZERO, gameArea),
        }
    );

    countdownLabel = new GameLabel(
        {
            id: "countdown-label",
            classList: ["absolute"],
            text: "3",
            rect2: rect2(vector2(4, 16), Vector2.NEGATIVE_ONE),
        }
    );

    setMainMenuVisible(false);
    [mainMenu, scoreLabel, countdownLabel].forEach(obj => obj.addToGame())

    subscribeToBtnClicks(gameBtnClickListener);
}


/**@param {HTMLElement} btn - GameBtn element */
const gameBtnClickListener = (btn) => {
    const btnText = btn.textContent;
    if (objIncludes(btnText, DIFFICULTY)) {
        setDifficulty(btnText);
        countdownToGameStart();
    }
}

const incrementScore = () => {
    score++;
}

const NAV_KEY = {
    ArrowUp: "ArrowUp",
    w: "w",
    ArrowDown: "ArrowDown",
    s: "s",
    Enter: "Enter",
}

/** @param {string} keyName - event.key */
const isNavKey = (keyName) => {
    return objIncludes(keyName, NAV_KEY);
}


/** @param {string} keyName - event.key */
const handleMenuNavigation = (keyName) => {
    assertIncludes(keyName, NAV_KEY);
    switch (keyName) {
        case NAV_KEY.ArrowUp:
        case NAV_KEY.w:
            mainMenu.offsetFocusedBtnIndex(-1);
            break;
        case NAV_KEY.ArrowDown:
        case NAV_KEY.s:
            mainMenu.offsetFocusedBtnIndex(1);
            break;
        case NAV_KEY.Enter:
            mainMenu.getFocusedBtn.click();
            break;
    }
}

export { NAV_KEY, isNavKey, initializeGUI, setMainMenuVisible, isMainMenuVisible,
            isCountdownLabelVisible, countdownToGameStart, incrementScore, updateScoreLabel, handleMenuNavigation };
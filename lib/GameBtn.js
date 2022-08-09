"use strict";
import { GameLabel } from "./GameLabel.js";
import { assertDoesNotInclude, assertIncludes, getNewElement } from "./Util.js";

/**@type {funtion[]} */
const subscriberFunctions = [];

/**@param {funtion} subscriberFunction - func to be called when a GameBtn is clicked */
const subscribeToBtnClicks = (subscriberFunction) => {
    if (subscriberFunctions.length){
        assertDoesNotInclude(subscriberFunction, subscriberFunctions);
    }
    subscriberFunctions.push(subscriberFunction);
}

const handleGameBtnClick = (event) => {
    const btn = event.target;
    subscriberFunctions.forEach(subscriberFunc => {
        subscriberFunc(btn);
    })
}

const GAME_BTN = {} // id:gameLabel

class GameBtn extends GameLabel {
    /**
     * Create a GameBtn object with an associated HTMLElement.
     * @param {{id: string, text: string, classList?: Array, rect2?: Rect2}} dataObj - initializer data
     */
    constructor(dataObj) {
        if (!dataObj.tagName) {
            dataObj.tagName = "game-btn";
        }
        super(dataObj);
        this.register(dataObj, GAME_BTN);

        this.getElement.addEventListener("click", handleGameBtnClick);
    }
}

export { subscribeToBtnClicks, handleGameBtnClick, GameBtn };
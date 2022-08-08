"use strict";

import { handleGameBtnClick } from "./GameBtn.js";
import { GameObj } from "./GameObj.js";
import { assertHasKey, assertTypes, crash, getNewElement, TYPE } from "./Util.js";

const GAME_MENU = {} // id:gameMenu

class GameMenu extends GameObj {
    constructor(dataObj){

        assertHasKey("btnStrings", dataObj);
        const btnStrings = dataObj.btnStrings;
        if (!Array.isArray(btnStrings)) {crash(`Not an array: `, btnStrings);}
        assertTypes(TYPE.string, ...btnStrings);

        dataObj.tagName = "game-menu";
        super(dataObj);

        this.register(dataObj, GAME_MENU);

        const title = dataObj.title;
        if (title) {
            const gameLabel = getNewElement("game-label");
            gameLabel.textContent = title;
            this.getElement.appendChild(gameLabel);
        }
        
        btnStrings.forEach(str => {
            const gameBtn = getNewElement("game-btn");
            gameBtn.textContent = str;
            gameBtn.addEventListener("click", handleGameBtnClick);
            this.getElement.appendChild(gameBtn);
        })        
    }
}

export { GameMenu }; 
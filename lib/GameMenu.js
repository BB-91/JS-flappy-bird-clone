"use strict";

import { handleGameBtnClick } from "./GameBtn.js";
import { GameObj } from "./GameObj.js";
import { assertDoesNotHaveKey, assertHasKey, assertNotNull, assertTypes, crash, getNewElement, TYPE } from "./Util.js";

const handleMenuBtnHovered = (event) => {
    const btn = event.target;
    const gameMenuElement = btn.parentElement;
    const gameMenu = GAME_MENU[gameMenuElement.id];

    const gameMenuBtns = Array.from(gameMenuElement.children);
    const btnIndex = gameMenuBtns.indexOf(btn);
    gameMenu.setFocusedBtnIndex = btnIndex; // this is an element, not the GameMenu obj
}

const GAME_MENU = {} // id:gameMenu
const GAME_MENU_BTNS = {} // gameMenuID: gameBtn[]

class GameMenu extends GameObj {

    #focusedBtnIndex = -1;
    #focusedBtn = null;
    #title = "";

    constructor(dataObj){
        assertHasKey("btnStrings", dataObj);
        const btnStrings = dataObj.btnStrings;
        if (!Array.isArray(btnStrings)) {crash(`Not an array: `, btnStrings);}
        if (!btnStrings.length) {crash("btnStrings array is empty");}
        assertTypes(TYPE.string, ...btnStrings);


        dataObj.tagName = "game-menu";
        super(dataObj);

        this.register(dataObj, GAME_MENU);
        const gameMenuID = dataObj.id;
        assertDoesNotHaveKey(gameMenuID, GAME_MENU_BTNS);
        GAME_MENU_BTNS[gameMenuID] = [];

        const title = dataObj.title;
        if (title) {
            this.#title = title;
            const gameLabel = getNewElement("game-label");
            gameLabel.textContent = title;
            this.getElement.appendChild(gameLabel);
        }

        btnStrings.forEach((str, index) => {
            const gameBtn = getNewElement("game-btn");
            const btnID = `${dataObj.id}-btn-${index}`;
            gameBtn.id = btnID;
            GAME_MENU_BTNS[gameMenuID].push(gameBtn);

            gameBtn.textContent = str;
            gameBtn.addEventListener("mouseenter", handleMenuBtnHovered);
            gameBtn.addEventListener("click", handleGameBtnClick);
            this.getElement.appendChild(gameBtn);
        })


        this.setFocusedBtnIndex = title ? 1 : 0;
    }


    /** @return {number} get the index of the last focused menu item (child GameBtn element) */
    get getFocusedBtnIndex() {return this.#focusedBtnIndex}

    /** @return {HTMLElement} get the focused menu item (child GameBtn element) */
    get getFocusedBtn() {return this.#focusedBtn}

    /** 
     * @param {number} index the index of the last focused menu item (child GameBtn element)
    */
     set setFocusedBtnIndex(index) {
        if (this.getFocusedBtnIndex != index) {
            if (this.getFocusedBtn) {
                this.getFocusedBtn.classList.remove("menu-focused");
            }
        }

        this.#focusedBtnIndex = index;
        const btn = this.getElement.children[index];
        assertNotNull(btn);
        btn.classList.add("menu-focused");
        this.#focusedBtn = btn;
    }


    offsetFocusedBtnIndex(offset) {
        if (Math.abs(offset) != 1) {crash("Offset must be either 1 or -1");}

        const childCount = this.getElement.childElementCount;
        const min = this.#title ? 1 : 0;

        const max = childCount;
        let index = this.getFocusedBtnIndex + offset;

        if (max <= 0) {crash("Max not greater than 0: ", max);}
        if (max <= min) {crash("max is not greater than min", min, max);}

        while (index < 0) {
            index += max;
        }
        
        let clampedIndex = index % max;
        if (this.#title && clampedIndex == 0) {
            if (offset == -1) {
                clampedIndex = max - 1;
            } else {
                clampedIndex = 1;
            }
        }

        this.setFocusedBtnIndex = clampedIndex;
    }
}

export { GameMenu }; 
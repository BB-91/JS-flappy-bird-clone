"use strict";

import { handleGameBtnClick } from "./GameBtn.js";
import { GameObj } from "./GameObj.js";
import { assertHasKey, assertNotNull, assertTypes, crash, getNewElement, TYPE } from "./Util.js";

const handleMenuBtnHovered = (event) => {
    const btn = event.target;
    const gameMenu = btn.parentElement;
    // const gameMenuBtns = Array(gameMenu.children);
    const gameMenuBtns = Array.from(gameMenu.children);
    gameMenuBtns.forEach(gameMenuBtn => {
        gameMenuBtn.classList.remove("menu-focused");
    })
}


const GAME_MENU = {} // id:gameMenu

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

        const title = dataObj.title;
        if (title) {
            this.#title = title;
            const gameLabel = getNewElement("game-label");
            gameLabel.textContent = title;
            this.getElement.appendChild(gameLabel);
        }

        btnStrings.forEach(str => {
            const gameBtn = getNewElement("game-btn");
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
        const childCount = this.getElement.childElementCount;
        const min = this.#title ? 1 : 0;
        const max = childCount - 1;
        // const clampedIndex =   Math.max(Math.min(index, max), min)
        const clampedIndex =   Math.min(Math.max(index, min), max)

        if (this.getFocusedBtnIndex != clampedIndex) {
            if (this.getFocusedBtn) {
                this.getFocusedBtn.classList.remove("menu-focused");
            }
        }

        console.log(`clampedIndex:`, clampedIndex);

        this.#focusedBtnIndex = clampedIndex;
        console.log(`this.getElement.children:`, this.getElement.children);
        const btn = this.getElement.children[clampedIndex];
        assertNotNull(btn);

        btn.classList.add("menu-focused");
        this.#focusedBtn = btn;
    }

    offsetFocusedBtnIndex(offset) {
        console.log("ENTERED offsetFocusedBtnIndex FUNC!!!");
        if (Math.abs(offset) != 1) {crash("Offset must be either 1 or -1");}
        this.setFocusedBtnIndex = this.getFocusedBtnIndex + offset;
    }
}

export { GameMenu }; 
import { GameObj } from "./GameObj.js";
import { assertHasKey, assertNotEmptyString, crash } from "./Util.js";

const GAME_LABEL = {} // id:gameLabel

class GameLabel extends GameObj {
    /**
     * Create a GameLabel object with an associated HTMLElement.
     * @param {{id: string, text: string, classList?: Array, rect2?: Rect2}} dataObj - initializer data
     */
    constructor(dataObj) {
        assertHasKey("text", dataObj);
        const text = dataObj.text;
        assertNotEmptyString(text);

        if (!dataObj.tagName) {
            dataObj.tagName = "game-label";
        }

        super(dataObj);
        this.register(dataObj, GAME_LABEL);

        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        this.getElement.appendChild(paragraph);
    }
}

export { GameLabel };
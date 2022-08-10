import { GameObj } from "./GameObj.js";
import { rect2 } from "./Rect2.js";
import { assertHasKey, assertNotEmptyString, crash } from "./Util.js";
import { vector2, Vector2 } from "./Vector2.js";

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

        this.getElement.textContent = text;

        if (!this.getRect2 && !dataObj.id.includes("menu")) { // set initial rect2 of floating label/btn
            const bodyFontSize = Number(window.getComputedStyle(document.body).getPropertyValue('font-size'));
            this.setRect2 = rect2(Vector2.ZERO, Vector2.NEGATIVE_ONE); // auto-fit size
        }
    }
}

export { GameLabel };
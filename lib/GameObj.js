import { TYPE, assertTypes, assertInstancesOf, getPropOrDefault, getNewElement } from './Util.js';
// import { Vector2 } from './Vector2.js'
import { Rect2 } from './Rect2.js'
import { Color } from './Color.js'
import { Vector2 } from './Vector2.js';

class GameObj {
    #rect2;
    #element = null;

    /**
     * Create an object with an associated HTMLElement.
     * @param {{?rect2: Rect2, ?backgroundColor: Color}} dataObj - initializer data
     */
    constructor(dataObj) {
        assertTypes(TYPE.object, dataObj);
        this.#rect2 = getPropOrDefault(dataObj.pos, Rect2, new Rect2(Vector2.ZERO, new Vector2(32, 32)));
        this.#element = getNewElement("sprite-rect");

        const bgColor = getPropOrDefault(dataObj.backgroundColor, Color, Color.RED);
        this.getElement.style.backgroundColor = bgColor.cssValueStr;

        this.getElement.style.width = `${this.getWidth}px`;
        this.getElement.style.height = `${this.getHeight}px`;
    }

    /** @return {Rect2} get the rect2 */
    get getRect2() {return this.#rect2}

    /** @return {Vector2} get the pos */
    get getPos() {return this.getRect2.getPos}

    /** @return {number} get the x coordinate */
    get getX() {return this.getRect2.getX}

    /** @return {number} get the y coordinate */
    get getY() {return this.getRect2.getY}

    /** @return {Vector2} get the size */
    get getSize() {return this.getRect2.getSize}

    /** @return {number} get the width */
    get getWidth() {return this.getRect2.getWidth}

    /** @return {number} get the height */
    get getHeight() {return this.getRect2.getHeight}

    /** @return {HTMLElement} get the size */
    get getElement() {return this.#element}    

    /** @param {Rect2} value set the rect2 */
    set setRect2(value) {
        assertInstancesOf(Rect2, value);
        this.#rect2 = value;
    }

    /** @param {Vector2} value set the pos */
    set setPos(value) {
        assertInstancesOf(Vector2, value);
        this.getRect2.setPos = value;
        this.setX = value.getX;
        this.setY = value.getY;
    }

    /** @param {number} value set the x coordinate */
    set setX(value) {
        assertTypes(TYPE.number, value);
        this.getRect2.setX = value;
        this.getElement.style.left = `${value}px`;
        console.log("set game object x pos!");
    }

    /** @param {number} value set the y coordinate */
    set setY(value) {
        assertTypes(TYPE.number, value);
        this.getRect2.setY = value;
        this.getElement.style.top = `${value}px`;
    }

    /** @param {Vector2} value set the size */
    set setSize(value) {
        assertInstancesOf(Vector2, value);
        this.setWidth = value.getX;
        this.setHeight = value.getY;
    }

    /** @param {number} value set the width */
    set setWidth(value) {
        assertTypes(TYPE.number, value);
        this.getRect2.setWidth = value;
        this.getElement.style.width = `${value}px`;
    }

    /** @param {number} value set the height */
    set setHeight(value) {
        assertTypes(TYPE.number, value);
        this.getRect2.setHeight = value;
        this.getElement.style.height = `${value}px`;
    }

    addToGame() {
        const gameContainer = document.querySelector("game-container");
        gameContainer.appendChild(this.getElement);
    }
}

export { GameObj };
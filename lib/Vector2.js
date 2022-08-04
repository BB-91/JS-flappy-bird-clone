"use strict";
import { TYPE, assertTypes } from './Util.js';

class Vector2{
    #x = 0;
    #y = 0;

    /**
     * Assign a position.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     */
    constructor(x, y) {
        assertTypes(TYPE.number, x, y);
        this.#x = x;
        this.#y = y;
    }

    /** @return {number} get the x coordinate */
    get getX() {return this.#x};

    /** @return {number} get the y coordinate */
    get getY() {return this.#y};

    /** @param {number} value - set the x coordinate */
    set setX(value) {assertTypes(TYPE.number, value); this.#x = value};

    /** @param {number} value - set the y coordinate */
    set setY(value) {assertTypes(TYPE.number, value); this.#y = value};

    /** @static Vector2(0, 0) */
    static get ZERO() {return new Vector2(0, 0)}

    /** @static Vector2(1, 1) */
    static get ONE() {return new Vector2(1, 1)}

    /** @static Vector2(-1, 0) */
    static get LEFT() {return new Vector2(-1, 0)}

    /** @static Vector2(1, 0) */
    static get RIGHT() {return new Vector2(1, 0)}

    /** @static Vector2(0, -1) */
    static get UP() {return new Vector2(0, -1)}

    /** @static Vector2(0, 1) */
    static get DOWN() {return new Vector2(0, 1)}

    /** @static Vector2(-1, -1) */
    static get UP_LEFT() {return new Vector2(-1, -1)}

    /** @static Vector2(1, -1) */
    static get UP_RIGHT() {return new Vector2(1, -1)}

    /** @static Vector2(-1, 1) */
    static get DOWN_LEFT() {return new Vector2(-1, 1)}

    /** @static Vector2(1, 1) */
    static get DOWN_RIGHT() {return new Vector2(1, 1)}
}

export { Vector2 };
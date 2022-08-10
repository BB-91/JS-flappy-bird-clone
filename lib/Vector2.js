"use strict";
import { TYPE, assertTypes, assertInstancesOf } from './Util.js';

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

    /** @param {Vector2} value - add other Vector2 to this  */
    add(value) {
        assertInstancesOf(Vector2, value);
        this.setX = this.getX + value.getX;
        this.setY = this.getY + value.getY;
    };

    /** @param {Vector2} value - multiply this by other Vector2 */
    multiply(value) {
        assertInstancesOf(Vector2, value);
        this.setX = this.getX * value.getX;
        this.setY = this.getY * value.getY;
    };

    /**
     * @static
     * @param {Vector2} vec1
     * @param {Vector2} vec2
     * @return {Vector2} get the sum of two Vector2s
     */
    static getAdded(vec1, vec2) {
        assertInstancesOf(Vector2, vec1, vec2);
        vec1.add(vec2);
        return vec1;
    };

    /**
     * @static
     * @param {Vector2} vec1
     * @param {Vector2} vec2
     * @return {Vector2} get the product of two Vector2s
     */
    static getMultiplied(vec1, vec2) {
        assertInstancesOf(Vector2, vec1, vec2);
        vec1.multiply(vec2);
        return vec1;
    };

    /**
     * @static
     * @param {Vector2} vec
     * @return {Vector2} get a copy of vec
     */
     static copy(vec) {
        assertInstancesOf(Vector2, vec);
        return new Vector2(vec.getX, vec.getY);
    };

    /** @static Vector2(0, 0) */
    static get NEGATIVE_ONE() {return new Vector2(-1, -1)}

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


/**
 * Assign a position.
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @return {Vector2} get a new Vector2
 */
const vector2 = (x, y) => {
    return new Vector2(x, y);
}

export { Vector2, vector2 };
"use strict";
import { TYPE, assertInstancesOf, assertTypes } from './Util.js';
import { Vector2 } from './Vector2.js'

class Rect2 {
    #pos = Vector2.ZERO;
    #size = Vector2.ZERO;

    /**
     * Assign a position and size.
     * @param {Vector2} pos - origin (top-left position)
     * @param {Vector2} size - width & height
     */
    constructor(pos, size) {
        assertInstancesOf(Vector2, pos, size);
        this.#pos = pos;
        this.#size = size;
    }

    /** @static _Rect2(0, 0) */
    // static get ZERO() {return new Rect2(Vector2.ZERO, Vector2.ZERO)}
    static get ZERO() {return new Rect2(Vector2.ZERO, Vector2.ZERO)}

    /** @return {Vector2} get the position */
    get getPos() {return this.#pos};

    /** @return {Vector2} get the x coordinate */
    get getX() {return this.getPos.getX};

    /** @return {Vector2} get the y coordinate */
    get getY() {return this.getPos.getY};

    /** @return {Vector2} get the size */
    get getSize() {return this.#size};

    /** @return {Vector2} get the width */
    get getWidth() {return this.getSize.getX};

    /** @return {Vector2} get the height */
    get getHeight() {return this.getSize.getY};

    /** @param {Vector2} value - set the origin (top-left position) */
    set setPos(value) {assertInstancesOf(Vector2, value); this.#pos = value;}

    /** @param {number} value - set the x coordinate */
    set setX(value) {assertTypes(TYPE.number, value); this.getPos.setX = value;}

    /** @param {number} value - set the y coordinate */
    set setY(value) {assertTypes(TYPE.number, value); this.getPos.setY = value;}

    /** @param {Vector2} value - set the width & height */
    set setSize(value) {assertInstancesOf(Vector2, value); this.#size = value;}

    /** @param {number} value set the width */
    set setWidth(value) {assertTypes(TYPE.number, value); this.getSize.setX = value;}

    /** @param {number} value set the height */
    set setHeight(value) {assertTypes(TYPE.number, value); this.getSize.setY = value;}
}

/**
 * Assign a position and size.
 * @param {Vector2} pos - origin (top-left position)
 * @param {Vector2} size - width & height
 * @return {Rect2} get a new Rect2
 */
const rect2 = (pos, size) => {
    return new Rect2(pos, size);
}

export { Rect2, rect2 };
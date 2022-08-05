"use strict";
import { TYPE, assertInstancesOf, assertTypes } from './Util.js';
import { Vector2, vector2 } from './Vector2.js';
import * as Physics from './Physics.js';

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

    /**
     * @static Rect2(0, 0)
     * @return {Vector2} get a new Rect2(0, 0)
    */
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


    /** @return {number} get pos of top edge (getY) */
    get getTop() {return this.getY;}

    /** @return {number} get pos of bottom edge (top + height) */
    get getBottom() {return this.getY + this.getHeight;}

    /** @return {number} get pos of left edge (getX) */
    get getLeft() {return this.getX;}

    /** @return {number} get pos of right edge (left + width) */
    get getRight() {return this.getX + this.getWidth;}

    /** @return {Vector2} get pos of bottom-right edge (Vector2(getRight, getBottom)) */
    get getEndPos() {return vector2(this.getRight, this.getBottom);}

    /**
     * @param {Rect2} otherRect2 - otherRect2
     * @return {boolean} Check if touches otherRect2
     */
    touches(otherRect2) {
        return Physics.touches(this, otherRect2);
    }

    /**
     * @param {Rect2} otherRect2 - otherRect2
     * @return {boolean} Check if overlaps otherRect2
     */
    overlaps(otherRect2) {
        return Physics.overlaps(this, otherRect2);
    }

    /**
     * @param {Rect2} otherRect2 - otherRect2
     * @return {boolean} Check if contains otherRect2
     */
     contains(otherRect2) {
        return Physics.contains(this, otherRect2);
    }

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
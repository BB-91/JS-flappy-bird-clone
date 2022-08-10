"use strict";
import { TYPE, assertTypes, assertWithinRange } from './Util.js';

class Color{
    #r = 0;
    #g = 0;
    #b = 0;
    #a = 0;

    /**
     * Create an rgba color (0.0 - 1.0 channel values).
     * @param {number} r - red value (0.0 - 1.0)
     * @param {number} g - green value (0.0 - 1.0)
     * @param {number} b - blue value (0.0 - 1.0)
     * @param {number} a - alpha value (0.0 - 1.0)
     */
    constructor(r, g, b, a) {
        assertTypes(TYPE.number, r, g, b, a);
        assertWithinRange(0, 1, r, g, b, a);
        this.#r = r;
        this.#g = g;
        this.#b = b;
        this.#a = a;
    }

    /** @return {number} get the red value */
    get getR() {return this.#r};

    /** @return {number} get the green value */
    get getG() {return this.#g};

    /** @return {number} get the blue value */
    get getB() {return this.#b};

    /** @return {number} get the alpha value */
    get getA() {return this.#a};

    /** @return {string} get the rbga string  */
    get cssValueStr() {
        const rgba = [this.#r, this.#g, this.#b].map(value => Math.round(value * 255));
        rgba.push(this.#a);
        // return `rgba(${rgba.join(', ')});`;
        return `rgba(${rgba.join(', ')})`;
    };

    /** @param {number} value - set the red value */
    set setR(value) {assertWithinRange(0, 1, value); this.#r = value};

    /** @param {number} value - set the red value */
    set setG(value) {assertWithinRange(0, 1, value); this.#g = value};

    /** @param {number} value - set the red value */
    set setB(value) {assertWithinRange(0, 1, value); this.#b = value};

    /** @param {number} value - set the red value */
    set setA(value) {assertWithinRange(0, 1, value); this.#a = value};

    /** @static Color(1, 0, 0, 1) */
    static get RED() {return new Color(1, 0, 0, 1)}

    /** @static Color(0, 1, 0, 1) */
    static get GREEN() {return new Color(0, 1, 0, 1)}

    /** @static Color(0, 0, 1, 1) */
    static get BLUE() {return new Color(0, 0, 1, 1)}

    /** @static Color(1, 1, 1, 1) */
    static get WHITE() {return new Color(1, 1, 1, 1)}

    /** @static Color(0, 0, 0, 1) */
    static get BLACK() {return new Color(0, 0, 0, 1)}

    /** @static Color(0.5, 0.5, 0.5, 1) */
    static get GRAY() {return new Color(0.5, 0.5, 0.5, 1)}

    /** @static Color(1, 1, 1, 0) */
    static get TRANSPARENT() {return new Color(1, 1, 1, 0)}
}


/**
 * Create an rgba color (0.0 - 1.0 channel values).
 * @param {number} r - red value (0.0 - 1.0)
 * @param {number} g - green value (0.0 - 1.0)
 * @param {number} b - blue value (0.0 - 1.0)
 * @param {number} a - alpha value (0.0 - 1.0)
 * @return {Color} get a new Color
 */
const color = () => {
    return new Color(r, g, b, a);
}

export { Color, color };
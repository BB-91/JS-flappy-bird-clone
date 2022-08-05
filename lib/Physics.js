"use strict";
import { assertDifferentObjects, crash } from "./Util.js";

/**
 * @param {Rect2} a - rectA
 * @param {Rect2} b - rectB
 * @return {boolean} Check if rectA touches rectB.
 */
 const touches = (a, b) => {
    assertDifferentObjects(a, b);
	if (a.getLeft > b.getRight || b.getLeft > a.getRight) {return false;} // has horizontal gap
	if (a.getTop > b.getBottom || b.getTop > a.getBottom) {return false;} // has vertical gap
	return true;
}

/**
 * @param {Rect2} a - rectA
 * @param {Rect2} b - rectB
 * @return {boolean} Check if rectA overlaps rectB.
 */
 const overlaps = (a, b) => {
    assertDifferentObjects(a, b);
	if (a.getLeft >= b.getRight || b.getLeft >= a.getRight) {return false;} // no horizontal overlap
	if (a.getTop >= b.getBottom || b.getTop >= a.getBottom) {return false;} // no vertical overlap
	return true;
}

/**
 * @param {Rect2} a - rectA
 * @param {Rect2} b - rectB
 * @return {boolean} Check if rectA contains rectB.
 */
 const contains = (a, b) => {
    assertDifferentObjects(a, b);
	return (
		a.getLeft <= b.getLeft &&
		a.getTop <= b.getTop &&
		a.getRight >= b.getRight &&
		a.getBottom >= b.getBottom
	);
}

export { touches, overlaps, contains };
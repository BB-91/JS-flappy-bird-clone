"use strict";

import { Vector2 } from './Vector2.js'

const TYPE = {
    bigint: "bigint",
    boolean: "boolean",
    function: "function",
    number: "number",
    object: "object",
    string: "string",
    symbol: "symbol",
    undefined: "undefined",
}
Object.freeze(TYPE);

const crash = (message) => {
    throw new Error(String(message));
}

const assertNotNull = (...args) => {
    if (!args.length) {crash(`Got an empty 'args' array`);}
    args.forEach((arg, index) => {
        if (arg == null || arg == undefined) {crash(`Argument ${index} is null or undefined: ${arg}`);}
    });
}

const assertWithinRange = (min, max, ...numbers) => {
    if (!numbers.length) {crash(`Got an empty 'numbers' array`);}
    assertTypes(TYPE.number, ...numbers);
    numbers.forEach(number => {
        if (number < min || number > max) {
            crash(`${number} is not within the range ${min} - ${max}`);
        }        
    })
}

const assertTypes = (expectedType, ...values) => {
    if (!values.length) {crash(`Got an empty 'values' array.`);}
    values.forEach(value => {
        if (value === expectedType) {crash(`Got same arg twice: ${value}`);}
        if (!Object.values(TYPE).includes(expectedType)) {crash(`Invalid expectedType: ${expectedType}`);}
        if (typeof expectedType != TYPE.string) {crash(`Not a string: ${expectedType}`);}
        const type = typeof value;
        if (type != expectedType) {
            crash(`Expected type: <${expectedType}>. Got <${type}>: ${value}`);
        }
    });
}

const assertInstancesOf = (expectedClass, ...values) => { // null/undefined values will fail
    if (!values.length) {crash(`Got an empty 'values' array.`);}
    values.forEach(value => {
        if (value === expectedClass) {crash(`Got same arg twice: ${value}`);}
        assertTypes(TYPE.function, expectedClass);
        if (!(value instanceof expectedClass)) {
            crash(`${value} is not an instance of ${expectedClass.name}`);
        }
    });
}

const getNewElement = (tagName) => {
    return document.createElement(tagName);
}

const getPropOrDefault = (value, expectedTypeOrClass, defaultValue) => {
    if (!value) {return defaultValue;}
    else {
        if (String(expectedTypeOrClass).startsWith("class")){
            assertInstancesOf(expectedTypeOrClass, value);
        } else {
            assertTypes(expectedTypeOrClass, value);
        }
        return value;
    }
}

export { TYPE, crash, assertNotNull, assertWithinRange,
                assertTypes, assertInstancesOf, getNewElement, getPropOrDefault };
"use strict";
import { vector2, Vector2 } from './Vector2.js'

const gameContainer = document.querySelector("game-container");

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

const crash = (...details) => {
    assertVariadicArgs(details); // pass details as variadic args to be able to inspect printed objects in dev tools
    console.log(`Crash details: `, ...details)
    throw new Error(details.join(" --- "));
}

const assertIsArray = (array) => {
    if (!Array.isArray(array)) {crash(`Not an array: ${array}`);}
}

const assertNotEmpty = (array) => {
    assertIsArray(array);
    if (!array.length) {crash("Array is empty");}
}

const assertNotEmptyString = (str) => {
    assertTypes(TYPE.string, str)
    if (str == "") {crash("str is empty");}
}

const objIncludes = (item, arrayOrObject) => {
    // passing additional args to prevent failed variadic arguments assertion
    assertTypes(TYPE.object, arrayOrObject, [], {}); // expects variadic args, not array (assumes accidentally passed array arg)
    let array;
    
    if (Array.isArray(arrayOrObject)) {
        array = arrayOrObject;
    } else {
        array = Object.values(arrayOrObject);
    }

    assertNotEmpty(array);
    assertNotNull(item);
    return array.includes(item);
}

const _assertIncludesOrNot = (item, arrayOrObject, shouldInclude) => {
    const isIncluded = objIncludes(item, arrayOrObject);
    if (shouldInclude){
        if (!isIncluded) {crash(`Item not in array.`, item, array)}
    } else {
        if (isIncluded) {crash(`Item already in array.`, item, array)}
    }
}

const assertIncludes = (item, arrayOrObject) => {
    _assertIncludesOrNot(item, arrayOrObject, true);
}

const assertDoesNotInclude = (item, arrayOrObject) => {
    _assertIncludesOrNot(item, arrayOrObject, false);
}


const _assertHasKeyOrNot = (key, obj, shouldHaveKey) => {
    assertTypes(TYPE.string, key);
    if (!key) {crash("key is empty");}
    assertNotNull(obj);

    const hasKey = obj.hasOwnProperty(key);
    if (shouldHaveKey){
        if (!hasKey) {crash(`Missing required key ("${key}")`, obj);}    
    } else {
        if (hasKey) {crash(`Key ("${key}") already in object`, obj);}
    }
}

/**
 * @param {string} key - property name
 * @param {Object} obj - object
 */
const assertHasKey = (key, obj) => {
    _assertHasKeyOrNot(key, obj, true);
}

/**
 * @param {string} key - property name
 * @param {Object} obj - object
 */
 const assertDoesNotHaveKey = (key, obj) => {
    _assertHasKeyOrNot(key, obj, false);
}

const assertVariadicArgs = (args) => {
    assertNotEmpty(args);
    if (args.length == 1) {
        const arg = args[0];
        if (Array.isArray(arg)) {
            crash("Expected multiple, variadic arguments. Got a single array argument:", arg);
        }
    }
}

const assertNotNull = (...args) => {
    assertVariadicArgs(args);
    args.forEach((arg, index) => {
        if (arg == null || arg == undefined) {
            crash("Argument", index, "is null or undefined:", arg);
        }
    });
}

const assertWithinRange = (min, max, ...numbers) => {
    assertVariadicArgs(numbers);
    assertTypes(TYPE.number, ...numbers);
    numbers.forEach(number => {
        if (number < min || number > max) {
            crash(`${number} is not within the range ${min} - ${max}`);
        }        
    })
}

const assertTypes = (expectedType, ...values) => {
    assertVariadicArgs(values);
    values.forEach(value => {
        if (value === expectedType) {crash("Got same arg twice:", value);}
        if (!Object.values(TYPE).includes(expectedType)) {crash(`Invalid expectedType: ${expectedType}`);}
        if (typeof expectedType != TYPE.string) {crash("Not a string:", expectedType);}
        const type = typeof value;
        if (type != expectedType) {
            crash(`Expected type: <${expectedType}>. Got <${type}>:`, value);
        }
    });
}

const assertInstancesOf = (expectedClass, ...values) => { // null/undefined values will fail
    assertVariadicArgs(values);
    values.forEach(value => {
        if (value === expectedClass) {crash(`Got same arg twice: ${value}`);}
        assertTypes(TYPE.function, expectedClass);
        if (!(value instanceof expectedClass)) {
            crash(value, `is not an instance of ${expectedClass.name}`);
        }
    });
}

const assertDifferentObjects = (...objects) => {
    assertVariadicArgs(objects);
    for (let i = 0; i < objects.length; i++) {
        if (count(objects[i], objects) > 1) {
            crash("Same object found at 2 different indexes", objects[i]);
        }
    }
}

/** @return {HTMLElement} get a new HTMLElement */
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

/** @return {number} get number of times 'thing' appears in 'array' */
const count = (thing, array) => {
    let counter = 0;
    assertNotEmpty(array);
    array.forEach(element => {
        if (Object.is(thing, element)) {
            counter++;
        }
    })
    return counter;
}

export { TYPE, crash, assertNotNull, objIncludes, assertIsArray, assertNotEmpty, assertNotEmptyString, assertIncludes, assertDoesNotInclude, assertHasKey, assertDoesNotHaveKey, assertWithinRange,
    assertTypes, assertInstancesOf, assertDifferentObjects, getNewElement, getPropOrDefault, count };
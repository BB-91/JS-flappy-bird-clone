"use strict";
import { assertDoesNotInclude, assertIncludes, getNewElement } from "./Util.js";

/**@type {funtion[]} */
const subscriberFunctions = [];

/**@param {funtion} subscriberFunction - func to be called when a GameBtn is clicked */
const subscribeToBtnClicks = (subscriberFunction) => {
    if (subscriberFunctions.length){
        assertDoesNotInclude(subscriberFunction, subscriberFunctions);
    }
    subscriberFunctions.push(subscriberFunction);
}

const handleGameBtnClick = (event) => {
    const btn = event.target;
    console.log("Clicked: ", btn);
    subscriberFunctions.forEach(subscriberFunc => {
        subscriberFunc(btn);
    })
}

export { subscribeToBtnClicks, handleGameBtnClick };
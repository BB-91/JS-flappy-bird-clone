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

/**
 * @param {string} title - menu title (or empty string)
 * @param {...string} otherBtnStrings - other button text strings
*/
const createMenu = (title, ...otherBtnStrings) => {
    const menuContainer = getNewElement("menu-container");
    if (title) {
        const gameLabel = getNewElement("game-label");
        gameLabel.textContent = title;
        menuContainer.appendChild(gameLabel);
    }

    otherBtnStrings.forEach(str => {
        const gameBtn = getNewElement("game-btn");
        gameBtn.textContent = str;
        gameBtn.addEventListener("click", handleGameBtnClick);
        menuContainer.appendChild(gameBtn);
    })

    return menuContainer;
}

export { createMenu, subscribeToBtnClicks };
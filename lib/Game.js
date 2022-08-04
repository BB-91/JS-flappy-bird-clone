import { vector2 } from './Vector2.js';

const gameContainer = document.querySelector("game-container");
const gameContainerStyle = getComputedStyle(gameContainer);
const gameArea = vector2(parseInt(gameContainerStyle.width), parseInt(gameContainerStyle.height))

export { gameContainer, gameArea };
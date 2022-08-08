import { GameObj } from "./GameObj.js";

const GAME_LABEL = {} // id:gameLabel

class GameLabel extends GameObj {
    constructor(dataObj) {
        dataObj.tagName = "game-label";
        super(dataObj);
        this.register(dataObj, GAME_LABEL);
    }
}

export { GameLabel };
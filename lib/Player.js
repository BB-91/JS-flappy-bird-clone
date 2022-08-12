"use strict";

import { Color } from "./Color.js";
import { endGame } from "./Game.js";
import { GameObj } from "./GameObj.js";
import { getObstacleData } from "./Obstacles.js";
import { rect2 } from "./Rect2.js";
import { playNextJumpSound } from "./SamplePlayer.js";
import { Vector2, vector2 } from "./Vector2.js";


const PLAYER_START_POS = vector2(4, 64);
const PLAYER_PIXEL_OUTLINE_THICKNESS = 1; // 1 pixel black outline
const PLAYER_IMAGE_PATH = "./images/FloppyDisk.png"
const GRAVITY = 1;
const JUMP_FORCE = -8;
let player;

const initializePlayer = () => {
    
    player = new GameObj(
        {
            id: "player",
            rect2: rect2(PLAYER_START_POS, vector2(16, 16)),
            imgSrc: PLAYER_IMAGE_PATH,
            backgroundColor: Color.WHITE,
        }
    );

    player.addToGame();
}

const resetPlayerPosition = () => {
    if (player) {
        player.setVelocity = Vector2.ZERO;
        player.setPos = PLAYER_START_POS;
    }
}


const jump = () => {
    playNextJumpSound();
    player.setVelocity = vector2(0, JUMP_FORCE);
}

const applyPlayerGravity = () => {
    const { FLOOR_HEIGHT, CEILING_HEIGHT, isFloorLethal, isCeilingLethal } = getObstacleData();


    player.offsetVelocity(vector2(0, GRAVITY));
    player.offsetPos(player.getVelocity);

    let minY = isCeilingLethal ? CEILING_HEIGHT : 0;
    let maxY = isFloorLethal ? player.getMaxY - FLOOR_HEIGHT : player.getMaxY;

    minY -= PLAYER_PIXEL_OUTLINE_THICKNESS;
    maxY += PLAYER_PIXEL_OUTLINE_THICKNESS;
    /* Looks better if the outline overlaps floor/ceiling during collision.
        Otherwise, with a black background, it doesn't look like the player is actually touching the floor/ceiling.
    */

    if (player.getY >= maxY) {
        player.setVelocity = Vector2.ZERO;
        player.setY = maxY;
        if (isFloorLethal) {
            endGame();
        }
    } else if (player.getY <= minY) {
        player.setVelocity = Vector2.ZERO;
        player.setY = minY;
        if (isCeilingLethal) {
            endGame();
        }
    }
}


const getPlayer = () => {
    return player;
}



export { initializePlayer, jump, applyPlayerGravity, getPlayer, resetPlayerPosition, PLAYER_PIXEL_OUTLINE_THICKNESS };
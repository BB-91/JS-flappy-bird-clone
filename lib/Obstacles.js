"use strict";
import { Color } from "./Color.js";
import { DIFFICULTY, endGame, gameArea } from "./Game.js";
import { GameObj } from "./GameObj.js";
import { incrementScore, updateScoreLabel } from "./GUI.js";
import { getPlayer, PLAYER_PIXEL_OUTLINE_THICKNESS } from "./Player.js";
import { rect2 } from "./Rect2.js";
import { crash } from "./Util.js";
import { Vector2, vector2 } from "./Vector2.js";

const WALL_WIDTH = 16;
const HOLE_HEIGHT = 85; // height of gap between walls
let WALL_SPAWN_X_POS;

const FLOOR_HEIGHT = 2;
const CEILING_HEIGHT = FLOOR_HEIGHT;


let wallSpeed = -8; // wall movement speed

let floor;
let ceiling;
let topWall;
let bottomWall;
let walls;
let isFloorLethal = true;
let isCeilingLethal = true;


const setLethalityAndWallSpeed = (_isFloorLethal, _isCeilingLethal, speed) => {
    isFloorLethal = _isFloorLethal;
    isCeilingLethal = _isCeilingLethal;
    wallSpeed = speed;

    floor.getElement.style.display = _isFloorLethal ? "inline-block" : "none";
    ceiling.getElement.style.display = _isCeilingLethal ? "inline-block" : "none";
}

const setObstacleDifficulty = (difficulty) => {
    switch (difficulty) {
        case DIFFICULTY.Easy:
            setLethalityAndWallSpeed(false, false, -4);
            break;
        case DIFFICULTY.Medium:
            setLethalityAndWallSpeed(false, true, -6);
            break;
        case DIFFICULTY.Hard:
            setLethalityAndWallSpeed(true, true, -8);
            break;
        case DIFFICULTY.Insane:
            setLethalityAndWallSpeed(true, true, -10);
            break;
        default:
            crash("Invalid case", difficulty);
    }
}


/** 
 * @param {string} wallID
 * @return {GameObj} get a Wall GameObj 
 * 
*/
const getNewWall = (wallID) => {
    return new GameObj(
        {
            id: wallID,
            rect2: rect2(Vector2.ZERO, vector2(WALL_WIDTH, (gameArea.getY - HOLE_HEIGHT) / 2.0)),
            backgroundColor: Color.RED,
        });
}

/** 
 * @param {string} ceilingOrFloorID
 * @return {GameObj} Get a new Floor or Ceiling GameObj
*/
const getNewFloorOrCeiling = (ceilingOrFloorID) => {
    if (!["floor", "ceiling"].includes(ceilingOrFloorID)) { crash("Invalid id", ceilingOrFloorID); }


    const obj = new GameObj(
        {
            id: ceilingOrFloorID,
            rect2: rect2(Vector2.ZERO, vector2(gameArea.getX, FLOOR_HEIGHT)),
            backgroundColor: Color.RED,
        });

    if (ceilingOrFloorID == "floor") {
        obj.setY = obj.getMaxY;
    }

    return obj;
}


const moveWalls = () => { // move walls toward the left edge of the screen, then reset position when offscreen. Check collision.
    let shouldPosReset = false;
    walls.forEach(wall => {
        if (wall.getX <= -WALL_WIDTH) { // if wall offscreen (left side)
            wall.setX = WALL_SPAWN_X_POS // move wall offscreen (right side)
            shouldPosReset = true;
        } else {
            wall.offsetPos(vector2(wallSpeed, 0));
        }
    })

    for (let i = 0; i < walls.length; i++) {
        if (walls[i].touches(getPlayer())) {
            endGame();
            break;
        }
    }

    if (shouldPosReset) {
        change_hole_pos();
        incrementScore();
        updateScoreLabel();
        
    }
}

const change_hole_pos = () => {
    const MIN_WALL_HEIGHT = 8;
    const SPACER = PLAYER_PIXEL_OUTLINE_THICKNESS + 1; // offscreen padding for disabled walls to prevent collision
    const randomInt = Math.floor(Math.random() * 5000);
    let holeTop = randomInt % (gameArea.getY - HOLE_HEIGHT + 1);

    if (holeTop < MIN_WALL_HEIGHT) { // disable top wall
        holeTop = -PLAYER_PIXEL_OUTLINE_THICKNESS - 1;
        holeTop = -SPACER;
        topWall.setHeight = 0;
        topWall.setY = holeTop;
    } else {
        topWall.setHeight = holeTop;
        topWall.setY = 0;
    }

    let holeBottom = holeTop + HOLE_HEIGHT;
    const testBottomWallHeight = gameArea.getY - holeBottom;

    if (testBottomWallHeight < MIN_WALL_HEIGHT) { // disable bottom wall
        holeBottom = SPACER;
        bottomWall.setHeight = 0;
    } else {
        bottomWall.setHeight = testBottomWallHeight;
    }

    bottomWall.setY = holeBottom;
}


const initializeObstacles = () => {
    WALL_SPAWN_X_POS = gameArea.getX + WALL_WIDTH;

    floor = getNewFloorOrCeiling("floor");
    ceiling = getNewFloorOrCeiling("ceiling");
    topWall = getNewWall("top-wall");
    bottomWall = getNewWall("bottom-wall");
    walls = [topWall, bottomWall];

    bottomWall.setY = bottomWall.getMaxY;
    walls.forEach(wall => wall.setX = WALL_SPAWN_X_POS);
    [ceiling, floor, topWall, bottomWall].forEach(obj => obj.addToGame());
}

const resetWallsPosition = () => {
    if (walls.length) {
        walls.forEach(wall => {
            wall.setX = WALL_SPAWN_X_POS;
        })
    }
}

const getObstacleData = () => {
    return { FLOOR_HEIGHT, CEILING_HEIGHT, isFloorLethal, isCeilingLethal }
}


export { initializeObstacles, moveWalls, setObstacleDifficulty, getObstacleData, resetWallsPosition };
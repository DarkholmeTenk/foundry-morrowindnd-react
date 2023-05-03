import {Graphics} from "pixi.js";
import {forEachCell, sortPosGrid} from "Util/Canvas/Grid/GridCellWalker";
import {drawHex} from "Util/Canvas/Graphics/DrawerHex";

export function drawRegion(g: Graphics, grid: GridLayer, points: [[number, number], [number, number]], color: number) {
    let {isHex} = grid
    g.beginFill(color)
    if(isHex) {
        forEachCell(grid, points, ({center, w})=>{
            drawHex(g, center, w / 2)
        })
    } else {
        let sorted = sortPosGrid(points[0], points[1])
        let [[sx, sy], [ex, ey]] = sorted
        console.log(points, sorted)
        let sPos = grid.grid.getPixelsFromGridPosition(sx, sy)
        let ePos = grid.grid.getPixelsFromGridPosition(ex + 1, ey + 1)
        let w = ePos[0] - sPos[0]
        let h = ePos[1] - sPos[1]
        g.drawRect(sPos[0], sPos[1], w, h)
    }
    g.endFill()
}
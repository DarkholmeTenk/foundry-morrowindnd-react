import {SimplePos} from "Systems/Traveller/Canvas/SimpleParts";
import {Graphics} from "pixi.js";
import {drawHex} from "Util/Canvas/Graphics/DrawerHex";

export function drawCell(g: Graphics, center: SimplePos, corner: SimplePos, grid: GridLayer) {
    if(grid.isHex) {
        if(grid.isHex)
            drawHex(g, center, grid.w/2)
        else
            g.drawRect(corner.x, corner.y, grid.w, grid.h)
    }
}
import {Graphics} from "pixi.js";
import {SimplePos} from "Systems/Traveller/Canvas/SimpleParts";

const Q = 0.866
const HexPoints = [[1, 0], [0.5, Q], [-0.5, Q], [-1, 0], [-0.5, -Q], [0.5, -Q]]
const OtherHexPoints = HexPoints.map(([x,y])=>([y, x]))

export function drawHex(g: Graphics, center: SimplePos, radius: number) {
    let points = OtherHexPoints.map(([x,y])=>({x: (x * radius)+center.x, y: (y * radius)+center.y}))
    g.drawPolygon(points)
}
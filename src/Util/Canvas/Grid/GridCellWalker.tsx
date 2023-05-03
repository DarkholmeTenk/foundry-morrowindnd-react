import {SimplePos} from "Systems/Traveller/Canvas/SimpleParts";

export function sortPosGrid(a: [number, number], b: [number, number]): [[number, number], [number, number]] {
    let mx = Math.min(a[0], b[0])
    let MX = Math.max(a[0], b[0])
    let my = Math.min(a[1], b[1])
    let MY = Math.max(a[1], b[1])
    return [[mx, my], [MX, MY]]
}

interface WalkerArgs {
    pos: [number, number]
    corner: SimplePos
    center: SimplePos,
    w: number,
    h: number
}
export function forEachCell({w, h, grid}: GridLayer, points: [[number, number], [number, number]], walker: (args: WalkerArgs)=>void) {
    let [start, end] = sortPosGrid(points[0], points[1])
    let halfW = w / 2
    let halfH = h / 2
    for(let x = start[0]; x <= end[0]; x++) {
        for (let y = start[1]; y <= end[1]; y++) {
            let [pixelPosX, pixelPosY] = grid.getPixelsFromGridPosition(x, y)
            let corner = {x: pixelPosX, y: pixelPosY}
            let center = {x: corner.x + halfW, y: corner.y + halfH}
            let args: WalkerArgs = { pos: [x,y], corner, center, w, h }
            walker(args)
        }
    }
}
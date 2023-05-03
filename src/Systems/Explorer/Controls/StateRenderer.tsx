import {Container, Graphics} from "pixi.js";
import {ExplorerLayerState} from "Systems/Explorer/Controls/States";
import {SimplePos} from "Systems/Traveller/Canvas/SimpleParts";
import {drawRegion} from "Systems/Explorer/Canvas/RegionDrawer";
import {RegionDataProvider} from "Systems/Explorer/Canvas/RegionDataProvider";
import {FallbackRegion} from "Systems/Explorer/Regions/SceneRegionFlag";

export type StateRenderer<T> = (container: Container, state: T, props: RegionDataProvider)=>Promise<void> | void

function fix({x,y}: SimplePos, {grid}: GridLayer): [number, number] {
    return grid.getGridPositionFromPixels(x,y)
}

function sort(a: [number, number], b: [number, number]): [[number, number], [number, number]] {
    let mx = Math.min(a[0], b[0])
    let MX = Math.max(a[0], b[0])
    let my = Math.min(a[1], b[1])
    let MY = Math.max(a[1], b[1])
    return [[mx, my], [MX, MY]]
}

export const StateRenderers: {[k in ExplorerLayerState["type"]]: StateRenderer<ExplorerLayerState & {type: k}>} = {
    none: ()=>{},
    create: (container, state, {grid, data})=>{
        let [start, end] = sort(fix(state.start, grid), fix(state.mousePos, grid))
        let region = data.regionTypes.find(x=>x.id === state.regionId) ?? FallbackRegion
        console.log(state, start, end, region)
        let g = container.addChild(new Graphics())
        drawRegion(g, grid, [start, end], region.color)
    }
}
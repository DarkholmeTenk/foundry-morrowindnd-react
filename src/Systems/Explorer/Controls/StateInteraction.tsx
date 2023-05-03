import {InteractionEvent} from "pixi.js";
import {ExplorerLayerState} from "Systems/Explorer/Controls/States";
import {SimplePos} from "Systems/Traveller/Canvas/SimpleParts";
import {RegionDataProvider} from "Systems/Explorer/Canvas/RegionDataProvider";
import {getMappedSetter, SetParam, useMappedSetter} from "Util/React/update/Updater";
import {SceneRegionFlag} from "Systems/Explorer/Regions/SceneRegionFlag";

type InteractionTypes = "onLeftClick" | "onLeftClick2" | "onDragLeftMove" | "onDragLeftCancel"
type AsyncInteractionTypes = "onDragLeftStart" | "onDragLeftDrop"
type InteractionHandler<T> = (e: InteractionEvent, state: T, provider: RegionDataProvider)=>ExplorerLayerState
type AsyncInteractionHandler<T> = (e: InteractionEvent, state: T, provider: RegionDataProvider)=>Promise<ExplorerLayerState> | ExplorerLayerState
export type InteractionManager<T> = Partial<{[k in InteractionTypes]: InteractionHandler<T>} & {[k in AsyncInteractionTypes]: AsyncInteractionHandler<T>}>

function pos(e: InteractionEvent): SimplePos {
    let data = e.data as any
    let {x,y} =  (data.destination ?? data.origin)
    return {x,y}
}

export const InteractionStateManager: {[key in ExplorerLayerState['type']]: InteractionManager<ExplorerLayerState & {type: key}>} = {
    none: {
        onDragLeftStart: (e, s, d) => {
            let ar = d.activeRegionId
            return ar ? {type: "create", regionId: ar, start: pos(e), mousePos: pos(e)} : s
        }
    },
    create: {
        onDragLeftMove: (e, s)=>({...s, mousePos: pos(e)}),
        onDragLeftDrop: async (e, s, d)=>{
            let p = pos(e)
            let v = getMappedSetter("regionMap", d.update)
            await v(x=>([...x, {region: s.regionId, start: [s.start.x, s.start.y], end: [p.x, p.y]}]))
            return {type: "none"}
        },
        onDragLeftCancel: ()=>({type: "none"})
    }
}
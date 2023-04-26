import {Circle, SimplePos} from "Systems/Traveller/Canvas/SimpleParts";
import {InteractionEvent} from "pixi.js";
import * as PIXI from "pixi.js";
import {getRegionFlag} from "Systems/Explorer/Regions/SceneRegionFlag";

interface CreateState {
    type: "create"
    regionId: string
    start: SimplePos
    mousePos: SimplePos
}

interface NoState {
    type: "none",
    onClick?: undefined
}

type State = NoState | CreateState

export class ExplorerLayer extends InteractionLayer {
    state: State = {type: "none"}

    clickHandlers: {[k in State['type']]: (pos: SimplePos, state: State & {type: k})=>void} = {
        none: (pos)=>{
            this.state = {
                type: "create",
                start: pos,
                regionId: "id_1",
                mousePos: pos
            }
        },
        create: (pos: SimplePos, state)=>{
            let {scene, grid} = canvas
            if(!scene) return

        }
    }

    draw() {
        this.removeChildren()
        let {scene, grid} = canvas
        if(!scene) return
        let flagData = getRegionFlag(scene)
        flagData.getBlocks().forEach((block)=>{
            let region = flagData.getRegion(block.region)
            for(let x = block.start[0]; x < block.end[0]; x++) {
                for(let y = block.start[1]; y < block.end[1]; y++) {
                    let pixelPos = grid.grid.getPixelsFromGridPosition(x, y)
                    let center = grid.getCenter(pixelPos[0], pixelPos[1])
                    this.addChild(new Circle(grid.w / 2, {x: center[0], y: center[1]}, {color: region.color}))
                }
            }
        })
    }

    _onClickLeft(event: InteractionEvent) {
        let pos: SimplePos = (event.data as any).coords
        let action = this.clickHandlers
    }
}
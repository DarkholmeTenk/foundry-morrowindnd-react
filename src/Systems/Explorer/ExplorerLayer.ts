import {Container, Graphics, InteractionEvent} from "pixi.js";
import {FallbackRegion, getRegionFlag, SceneRegionFlag} from "Systems/Explorer/Regions/SceneRegionFlag";
import {ExplorerLayerState} from "Systems/Explorer/Controls/States";
import {InteractionManager, InteractionStateManager} from "Systems/Explorer/Controls/StateInteraction";
import {StateRenderer, StateRenderers} from "Systems/Explorer/Controls/StateRenderer";
import {drawRegion} from "Systems/Explorer/Canvas/RegionDrawer";
import {RegionDataProvider} from "Systems/Explorer/Canvas/RegionDataProvider";
import {callUpdater, SetParam} from "Util/React/update/Updater";
import {ActiveRegion} from "Systems/Explorer/Regions/ActiveRegion";

export class ExplorerLayer extends InteractionLayer implements RegionDataProvider {
    state: ExplorerLayerState = {type: "none"}
    stateContainer: Container = new Container()
    update: (x: SetParam<SceneRegionFlag>)=>Promise<void> = async(x)=>{
        let [original, setter] = getRegionFlag(this.scene)
        await setter(callUpdater(original, x))
    }

    static get layerOptions() {
        return mergeObject(super.layerOptions, {
            name: "explorer",
            canDragCreate: true,
            zIndex: 10
        });
    }

    get scene() {
        return canvas.scene!
    }

    get data() {
        return getRegionFlag(this.scene)[0]
    }

    get grid() {
        return canvas.grid
    }

    get activeRegionId(): string | undefined {
        let v = ActiveRegion.value
        if(!v) return v
        let d = this.data
        let found = d.regionTypes.find(x=>x.id === v)
        return found ? v : undefined
    }

    draw() {
        this.removeChildren()
        this.stateContainer = new Container()
        let {grid, data: flagData} = this
        flagData.regionMap.forEach((block)=>{
            let graphics = this.addChild(new Graphics())
            let region = flagData.regionTypes.find(x=>x.id === block.region) ?? FallbackRegion
            drawRegion(graphics, grid, [block.start, block.end], region.color)
        })
        this.renderAllState()
        this.addChild(this.stateContainer)
    }

    async renderState<T extends ExplorerLayerState>(state: T) {
        this.stateContainer.removeChildren()
        let renderer = StateRenderers[state.type] as StateRenderer<T>
        await renderer(this.stateContainer, state, this)
    }

    async renderAllState() {
        await this.renderState(this.state)
    }

    async action<T extends ExplorerLayerState>(e: InteractionEvent, k: keyof InteractionManager<any>) {
        let {state, data} = this
        if(!data) return
        let s = state as T
        let actionManager = InteractionStateManager[s.type] as InteractionManager<T>
        let action = actionManager[k]
        if(action) {
            this.state = await action(e, s, this)
            await this.renderAllState()
        }
    }

    _onClickLeft(event: InteractionEvent) {
        this.action(event, "onLeftClick")
    }

    async _onDragLeftStart(event: InteractionEvent) {
        await this.action(event, "onDragLeftStart")
    }

    _onDragLeftMove(event: InteractionEvent) {
        this.action(event, "onDragLeftMove")
    }

    async _onDragLeftDrop(event: InteractionEvent)  {
        await this.action(event, "onDragLeftDrop")
    }
}
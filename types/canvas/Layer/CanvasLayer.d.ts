import {Container, InteractionEvent} from "pixi.js";

export {}

declare global {
    class CanvasLayer extends Container {
        static get layerOptions(): any
        draw()
        _draw()
    }

    class InteractionLayer extends CanvasLayer {
        active: boolean
        activate(args: {tool: string})
        deactivate()
        _onClickLeft(event: InteractionEvent)
        _onClickLeft2(event: InteractionEvent)
        _onDragLeftStart(event: InteractionEvent): Promise<void>
        _onDragLeftMove(event: InteractionEvent)
        _onDragLeftDrop(event: InteractionEvent): Promise<void>
        _onDragLeftCancel(event: InteractionEvent)
        _onClickRight(event: InteractionEvent)
        _onMouseWheel(event: InteractionEvent)
        _onDeleteKey(event: InteractionEvent): Promise<void>
    }

    class PlaceablesLayer extends InteractionLayer {

    }
}
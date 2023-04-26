import {Container, InteractionEvent} from "pixi.js";

export {}

declare global {
    class CanvasLayer extends Container {
        draw()
        _draw()
    }

    class InteractionLayer extends CanvasLayer {
        active: boolean
        activate(args: {tool: string})
        deactivate()
        _onClickLeft(event: InteractionEvent)
        _onClickLeft2(event: InteractionEvent)
    }

    class PlaceablesLayer extends InteractionLayer {

    }
}
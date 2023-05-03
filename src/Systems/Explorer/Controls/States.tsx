import {SimplePos} from "Systems/Traveller/Canvas/SimpleParts";

interface NullState {
    type: "none"
}

interface CreateState {
    type: "create"
    regionId: string
    start: SimplePos
    mousePos: SimplePos
}

export type ExplorerLayerState = NullState | CreateState
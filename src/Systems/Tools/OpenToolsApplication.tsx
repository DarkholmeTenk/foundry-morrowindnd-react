import {openReactApplication} from "Util/React/openReactApplication";
import {ToolsApplication} from "Systems/Tools/ToolsApplication";

export function openToolsApplication() {
    openReactApplication(<ToolsApplication/>, {width: 1200, height: 800})
}
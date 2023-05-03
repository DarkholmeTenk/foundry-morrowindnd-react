import {openReactApplication} from "Util/React/openReactApplication";
import {RegionEditorComponent} from "Systems/Explorer/Regions/Editor/RegionEditorComponent";

export function openRegionEditor() {
    openReactApplication(<RegionEditorComponent />, {width: 800, height: 600})
}
import {SceneRegionFlag} from "Systems/Explorer/Regions/SceneRegionFlag";
import {UpdateCallback} from "Util/React/update/Updater";

export interface RegionDataProvider {
    data: SceneRegionFlag
    grid: GridLayer
    update: (d: SceneRegionFlag | UpdateCallback<SceneRegionFlag>)=>Promise<void>
    activeRegionId: string | undefined
}
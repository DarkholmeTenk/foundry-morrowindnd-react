import getFlag from "Util/Helper/FlagHelper";

export interface RegionType {
    id: string,
    name: string,
    parentId?: string,
    color: number
}

export interface RegionBlock {
    start: [number, number]
    end: [number, number]
    region: string
}

export interface SceneRegionFlag {
    regionTypes: RegionType[]
    regionMap: RegionBlock[]
}

export const FallbackRegion: RegionType = {id: "null", name: "UNKNOWN", color: 0xFF0000}
const DefaultFlag: SceneRegionFlag = {
    regionTypes: [],
    regionMap: []
}

export function getRegionFlag(scene: Scene) {
    return getFlag(scene, "SceneRegions", DefaultFlag)
}
interface RegionType {
    id: string,
    name: string,
    parentId?: string,
    color: number
}

interface RegionBlock {
    start: [number, number]
    end: [number, number]
    region: string
}

interface SceneRegionFlag {
    regionTypes: RegionType[]
    regionMap: RegionBlock[]
}

export class SceneRegionData {
    private regions: Record<string, RegionType>
    constructor(private data: SceneRegionFlag, private setter: (nv: SceneRegionFlag)=>Promise<void>) {
        this.regions = {}
        data.regionTypes.forEach(x=>this.regions[x.id] = x)
    }
    getRegion(id: string): RegionType {
        let x = this.regions[id]
        return x ?? {id, name: "UNKNOWN", color: 0x00FF00}
    }

    getBlocks() {
        return this.data.regionMap
    }
}

export function getRegionFlag(scene: Scene): SceneRegionData {
    let data: SceneRegionFlag = {
        regionTypes: [{
            id: "id_1",
            name: "Region",
            color: 0xFF0000
        }],
        regionMap: [
            {start: [3, 3], end: [6, 10], region: "id_1"}
        ]
    }
    return new SceneRegionData(data, (v)=>Promise.resolve())
}
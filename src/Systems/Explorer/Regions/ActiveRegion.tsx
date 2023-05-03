import {string} from "prop-types";
import {useState} from "react";
import {RegionType} from "Systems/Explorer/Regions/SceneRegionFlag";
import {SelectorField} from "Util/Components/Selector/Selector";

interface ActiveRegionData {
    value: string | undefined
}
export const ActiveRegion: ActiveRegionData  = {
    value: undefined
}

export function useActiveRegion(): [value: string | undefined, setter: (v: string | undefined)=>void] {
    let [x, setX] = useState(ActiveRegion.value)
    let set = (v: string | undefined)=>{
        setX(v)
        ActiveRegion.value = v
    }
    return [x, set]
}

function name(id: string | undefined, regions: RegionType[]) {
    if(!id) return ""
    return regions.find(x=>x.id === id )?.name ?? id
}

interface Props {
    regions: RegionType[]
}
export function ActiveRegionChooser({regions}) {
    let [region, setRegionState] = useState(ActiveRegion.value)
    let set = (v: string | undefined)=>{
        setRegionState(v)
        ActiveRegion.value = v
    }
    return <SelectorField value={region} setter={set} label={"Active Region"} values={regions.map(x=>x.id)} labelFunction={x=>name(x,regions)} includeNull/>
}
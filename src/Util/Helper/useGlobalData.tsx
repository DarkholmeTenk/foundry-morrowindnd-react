import {useEffect} from "react";
import {useForceUpdate} from "./useForceUpdate";
import {useIsGm} from "../React/core/GmContext";
import getFlag, {FLAG_SCOPE} from "./FlagHelper";
import {useWatchEntity} from "./EntityHelper";

let inProgress: Promise<void> | undefined

async function create<T>(name: string, defaultValue: T) {
    if(game.journal?.getName("data_"+name)) return
    let journal = await JournalEntry.create({name: "data_" + name})
    await journal?.setFlag(FLAG_SCOPE, "global_data", defaultValue)
}

interface InProgressData {
    state: "in_progress"
}
interface UnsetData {
    state: "unset"
}
interface LoadedData<T> {
    state: "loaded"
    data: T
    setData: (data: T)=>Promise<void>
}
type GlobalData<T> = UnsetData | InProgressData | LoadedData<T>
export function useGlobalData<T extends object>(name: string, defaultValue: T): GlobalData<T> {
    let refresh = useForceUpdate()
    let isGM = useIsGm()
    let journal = game.journal?.getName("data_"+name)
    useWatchEntity<JournalEntry>(journal)
    useEffect(()=>{
        let x = async ()=>{
            if(journal) return
            if(isGM) {
                await inProgress
                inProgress = create(name, defaultValue)
                await inProgress
            }
            refresh()
        }
        x()
    }, [journal, isGM, refresh])
    if(!journal) {
        if(isGM) return { state: "in_progress" }
        return {state: "unset"}
    } else {
        let [data, setData] = getFlag<T>(journal, "global_data", defaultValue)
        return {
            state: "loaded",
            data,
            setData
        }
    }
}
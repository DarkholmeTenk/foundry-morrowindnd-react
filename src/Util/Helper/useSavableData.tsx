import {StateSetter} from "Util/React/update/Updater";
import {useEffect, useState} from "react";
import {useClosingPrevention} from "Util/React/core/MixinContext";
import {FlagResult} from "Util/Helper/FlagHelper";

export function useSavableData<T>(initialData: T, save: (newValue: T)=>(void | Promise<void>)): [T, StateSetter<T>, ()=>Promise<void>, boolean] {
    let {stopClosing, enableClosing} = useClosingPrevention()
    let [saved, setSaved] = useState(initialData)
    let [value, setValue] = useState(initialData)
    let doSave = async ()=>{
        await save(value)
        setSaved(value)
    }
    useEffect(()=>{
        if(value === saved) return
        stopClosing()
        return ()=>enableClosing()
    }, [value, saved])
    return [value, setValue, doSave, value!==saved]
}

export function useSavableFlag<T>(flag: FlagResult<T>) {
    let [v, s] = flag
    return useSavableData(v, s)
}
import React, {useCallback, useState} from "react";
import Selector from "../../Util/Components/Selector";
import {getPack, getPackId} from "../../Util/Identifiers/PackId";
import {Button} from "@material-ui/core";

export const PackSelectorOptions = {
    width: 600,
    height: 700
}

function labeler(x){
    let meta = getPack(x)?.metadata
    let name = meta?.label || "?"
    let source = meta?.package || "?"
    return `${name} (${source})`
}

function PackSelector({pack, index, setPack, remove}) {
    let setValue = useCallback((newValue)=>{
        setPack(index, newValue)
    }, [setPack])

    return <div className="flexrow" >
        <Selector values={game.packs.map(p=>getPackId(p))} value={pack} setValue={setValue} labelFunction={labeler} />
        <a style={{flexGrow: 0}} onClick={remove}><i className="fas fa-trash"/></a>
    </div>
}

export default function PackSelectorComponent({setting}) {
    let [packs, setPacks] = useState(setting.value || [])
    let save = useCallback(()=>{
        setting.value = packs
    }, [setting, packs])
    let add = useCallback(()=>{
        setPacks((prev)=>[...prev, null])
    }, [])
    let remove = useCallback((index)=>{
        setPacks((prev)=>{
            let newPacks = [...prev]
            newPacks.splice(index, 1)
            return newPacks
        })
    }, [setPacks])
    let set = useCallback((index, newValue)=>{
        setPacks((prev)=>{
            let newPacks = [...prev]
            newPacks[index] = newValue
            return newPacks
        })
    }, [setPacks])

    return <div>
        {packs.map((p, i)=><PackSelector pack={p} index={i} setPack={set} key={i} remove={remove}/>)}
        <Button onClick={add}>+</Button>
        <Button onClick={save}>Save</Button>
    </div>
}
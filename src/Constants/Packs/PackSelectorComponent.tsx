import React, {useCallback, useState} from "react";
import Selector from "../../Util/Components/Selector/Selector";
import {Button} from "@mui/material";
import {getPackId} from "../../Util/Identifiers/PackHelper";
import {useArrayReducers} from "Util/Helper/ArrayReducers";
import {DeleteIcon} from "Util/Components/SimpleComponents/IconLibrary";

export const PackSelectorOptions = {
    width: 600,
    height: 700
}

function labeler(x){
    let meta = game.packs.get(x)?.metadata
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
        <a style={{flexGrow: 0}} onClick={remove}><i className={DeleteIcon}/></a>
    </div>
}

export default function PackSelectorComponent({setting}) {
    let [packs, setPacks] = useState(setting.value || [])
    let save = useCallback(()=>{
        setting.value = packs
    }, [setting, packs])
    let [set, add, remove] = useArrayReducers(setPacks)

    return <div>
        {packs.map((p, i)=><PackSelector pack={p} index={i} setPack={set} key={i} remove={remove}/>)}
        <Button onClick={add}>+</Button>
        <Button onClick={save}>Save</Button>
    </div>
}
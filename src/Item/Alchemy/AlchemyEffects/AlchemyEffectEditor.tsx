import {AlchemyEffect, AlchemyEffects, AlchemyResult, DefaultAlchemyEffect} from "./AlchemyEffects";
import {useCallback, useState} from "react";
import {onItemDrop} from "../../../Util/Helper/DropHelper";
import {getItem, getItemId} from "../../../Util/Identifiers/ItemID";
import {Button, TextField} from "@material-ui/core";
import ItemViewer from "../../../Util/Components/ItemViewer";
import {usePromise} from "../../../Util/Helper/PromiseHelper";
import IconButton from "../../../Util/Components/IconButton";
import ArrayHelper from "../../../Util/Components/ArrayHelper";

interface AlchemyResultEditorArgs {
    value: Partial<AlchemyResult>
    setValue: (result: Partial<AlchemyResult>)=>void
}
function AlchemyResultEditor({value, setValue}: AlchemyResultEditorArgs) {
    let setDC = useCallback((e)=>setValue({...value, dc: parseInt(e.target.value)}), [setValue, value])
    let dropItem = useCallback(onItemDrop((i)=> setValue({...value, itemId: getItemId(i)})), [setValue, value])
    let {result: item} = usePromise(async ()=>value.itemId ? getItem(value.itemId) : null, [value.itemId])
    return <div onDrop={dropItem} style={{display: "flex", flexDirection: "row"}}>
        <div style={{}}>
            {item ? <ItemViewer item={item} /> : "Drop an item here" }
        </div>
        <TextField label="DC" type="number" value={value.dc || 10} onChange={setDC} />
    </div>
}

interface AlchemyEffectEditorArgs {
    value: Partial<AlchemyEffect>
    setValue: (value: Partial<AlchemyEffect>)=>void
}
function AlchemyEffectEditor({value, setValue}: AlchemyEffectEditorArgs) {
    let results = value.results || []
    let setLabel = useCallback((e)=>setValue({...value, label: e.target.value}), [value, setValue])
    let setId = useCallback((e)=>setValue({...value, id: e.target.value}), [value, setValue])
    let setIcon = useCallback((e)=>setValue({...value, icon: e.target.value}), [value, setValue])
    let setResults = useCallback((r)=>setValue({...value, results: r}), [value, setValue])
    
    let [expanded, setExpanded] = useState(false)
    let toggle = useCallback(()=>setExpanded(x=>!x), [setExpanded])

    return <div style={{display: "flex", flexDirection: "column"}}>
        Effect:
        <div style={{flexGrow: 1, flexDirection: "row"}}>
            <TextField value={value.id || ""} label="ID" onChange={setId} />
            <TextField value={value.label || ""} label="Label" onChange={setLabel} />
            <TextField value={value.icon || ""} label="Icon" onChange={setIcon} />
            {value.icon ? <i className={value.icon} /> : null}
        </div>
        <IconButton clz={expanded ? "fas fa-minus" : "fas fa-plus"} onClick={toggle} />
        <div style={{marginLeft: "15px", display: expanded ? "flex" : "none", flexDirection: "column"}} >
            <p>Results:</p>
            {expanded ? <ArrayHelper value={results} setValue={setResults} component={AlchemyResultEditor} newValueGetter={{itemId: undefined, dc: 10}} label="Effect Result"/> : null }
        </div>
    </div>
}

interface AlchemyEffectsEditorArgs {
    effects: AlchemyEffects
    setEffects: (effects: AlchemyEffects) => void
}
export function AlchemyEffectsEditor({effects, setEffects}: AlchemyEffectsEditorArgs) {
    return <ArrayHelper value={effects} setValue={setEffects} component={AlchemyEffectEditor} newValueGetter={DefaultAlchemyEffect} label="Effect"/>
}
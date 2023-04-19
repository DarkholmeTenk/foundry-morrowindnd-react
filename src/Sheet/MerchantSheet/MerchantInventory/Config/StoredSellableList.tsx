import {StoredSellable} from "Sheet/MerchantSheet/MerchantInventory/Settings";
import {StateSetter} from "Util/React/update/Updater";
import {useState} from "react";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {mapSort, StringSorter} from "Util/Sorting";
import Styles from "./SellableSourceEditor.module.scss"

function isValid(value: StoredSellable, renaming: undefined | {id: string | undefined, current: string}) {
    if(!renaming) return true
    let {id, current} = renaming
    if(current === id) return true
    return Object.keys(value).every(x=>x !== current)
}

interface Props {
    value: StoredSellable,
    setValue: StateSetter<StoredSellable>
    setEditing: (id: string)=>void
}
export function StoredSellableList({value, setValue, setEditing}: Props) {
    let [renaming, setRenaming] = useState<undefined | {id: string  | undefined, current: string}>()
    let rename = (id: string)=>setRenaming({id, current:  id})
    let commit = ()=>{
        if(!renaming) return
        let {id, current} = renaming
        let existing = (id ? value[id] : undefined) ?? {name: current, icon: "", type: "nested", sellables: []}
        existing.name = current
        setValue((old)=>{
            let newValue = {...old}
            if(id) delete newValue[id]
            newValue[current] = existing
            return newValue
        })
        setRenaming(undefined)
    }
    let deleteValue = (key: string)=>{
        setValue(old=>{
            let newValue = {...old}
            delete newValue[key]
            return newValue
        })
    }
    let values = Object.keys(value).map(key=>({key, sellable: value[key]})).sort(mapSort(x=>x.sellable.name, StringSorter))
    return <div className={Styles.StoredSellableList}>
        {renaming && <div className="flex-row">
            <input value={renaming.current} onChange={(e)=>setRenaming(o=>({id: o?.id, current: e.target.value}))}/>
            <Button onClick={commit} disabled={!isValid(value, renaming)} icon="fas fa-check" />
            <Button onClick={()=>setRenaming(undefined)} icon="fas fa-xmark" />
        </div>}
        <ul>
            {values.map(({key, sellable})=><li key={key}>
                <span>{sellable.name}</span>
                <div>
                    <Button onClick={()=>rename(key)} icon="fas fa-strikethrough" />
                    <Button onClick={()=>setEditing(key)} icon="fas fa-pen-to-square" />
                    <Button onClick={()=>deleteValue(key)} icon="fas fa-trash" />
                </div>
            </li>)}
        </ul>
        <div>
            {!renaming && <Button onClick={()=>setRenaming({id: undefined, current: "New One"})}>New</Button>}
        </div>

    </div>
}
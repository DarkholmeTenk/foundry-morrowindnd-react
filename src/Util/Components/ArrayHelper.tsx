import React, {useCallback} from "react";
import IconButton from "./IconButton";
import {Button} from "@mui/material";
import {useArrayReducers} from "../Helper/ArrayReducers";
import {StateSetter} from "../React/update/Updater";

export interface ArrayFunctionArgs<T> {
    value: T,
    setValue: (T)=>void
} 
type ArrayFunction<T> = (args: ArrayFunctionArgs<T>)=>JSX.Element

interface ArrayLineArgs<T> {
    index: number,
    value: T,
    component: ArrayFunction<T>
    deleteItem: (index: number)=>void
    setItem: (index: number, value: T)=>void
}
function ArrayLine<T>({index, value, deleteItem, setItem, component: Component}: ArrayLineArgs<T>) {
    let deleteIt = useCallback(()=>deleteItem(index), [deleteItem, index])
    let setValue = useCallback((v)=>setItem(index, v), [index, setItem])
    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{flexGrow: 1}}>
                <Component value={value} setValue={setValue} />
            </div>
            <div>
                <IconButton onClick={deleteIt} title="Delete Effect" clz="fas fa-trash" size="large" />
            </div>
        </div>
    );
}

function getNew<T>(getter: NewValueGetter<T>): T {
    if(typeof getter === "function") {
        return (getter as (()=>T))()
    } else {
        return getter
    }
}

type NewValueGetter<T> = T | (()=>T)
interface ArrayHelperArgs<T> {
    value: T[],
    setValue: StateSetter<T[]>,
    component: ArrayFunction<T>,
    newValueGetter: NewValueGetter<T>,
    label?: string
}
export default function ArrayHelper<T>({value, setValue, component, newValueGetter, label}: ArrayHelperArgs<T>) {
    let [setItem, addItem, deleteItem] = useArrayReducers(setValue)
    let rows = value.map((v,i)=><ArrayLine key={i} index={i} value={v} component={component} deleteItem={deleteItem} setItem={setItem} />)
    return <div style={{display: "flex", flexDirection: "column"}} >
        {rows}
        <Button onClick={()=>addItem(getNew(newValueGetter))}>Create {label}</Button>
    </div>
}
import React, {useCallback} from "react";
import IconButton from "./IconButton";
import {Button} from "@material-ui/core";

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
    return <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{flexGrow: 1}}>
            <Component value={value} setValue={setValue} />
        </div>
        <div>
            <IconButton onClick={deleteIt} title="Delete Effect" clz="fas fa-trash"/>
        </div>
    </div>
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
    setValue: (newValue: T[])=>void,
    component: ArrayFunction<T>,
    newValueGetter: NewValueGetter<T>,
    label?: string
}
export default function ArrayHelper<T>({value, setValue, component, newValueGetter, label}: ArrayHelperArgs<T>) {
    let addItem = useCallback(()=>setValue([...value, getNew(newValueGetter)]), [newValueGetter, value, setValue])
    let deleteItem = useCallback((index: number)=>setValue(value.filter((i,x)=>x !== index)), [value, setValue])
    let setItem = useCallback((index: number, newValue: T)=>{
        let nr = [...value]
        nr[index] = newValue
        setValue(nr)
    }, [value, setValue])
    let rows = value.map((v,i)=><ArrayLine key={i} index={i} value={v} component={component} deleteItem={deleteItem} setItem={setItem} />)
    return <div style={{display: "flex", flexDirection: "column"}} >
        {rows}
        <Button onClick={addItem}>Create {label}</Button>
    </div>
}
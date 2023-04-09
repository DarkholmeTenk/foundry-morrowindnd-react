import {InOut, ObjectUpdater} from "Util/React/update/ObjectUpdater";
import {useCallback, useMemo} from "react";
import {TextField} from "@mui/material";

interface SimpleInputArgs<T extends object, U> {
    label: string,
    data: T
    updater: ObjectUpdater<T>,
    field: InOut<T, U>,
    converter: InOut<string, U>
}
export function SimpleInput<T extends object, U>({label, data, updater, field, converter}: SimpleInputArgs<T, U>) {
    let fieldUpdater = useMemo(()=>updater.field(field), [updater, field])
    let value = field.in(data)
    let onChange = useCallback((e)=>fieldUpdater.set(converter.in(e.target.value)), [fieldUpdater, converter])
    return <TextField value={value} onChange={onChange} title={label} label={label} />
}

export const NumberInOut: InOut<string, number> = {
    in: (x)=>{
        let val = parseInt(x)
        if(isNaN(val)) return 0
        return val
    },
    out: (x)=>x.toString()
}

export const StringInOut: InOut<string, string> = {
    in: x=>x,
    out: x=>x
}
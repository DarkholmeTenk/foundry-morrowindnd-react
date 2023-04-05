import {InOut, ObjectUpdater} from "Util/React/update/ObjectUpdater";
import {useCallback, useMemo} from "react";
import {Checkbox, FormControlLabel} from "@material-ui/core";

interface SimpleCheckboxArgs<T extends object> {
    data: T,
    field: InOut<T, boolean>
    updater: ObjectUpdater<T>,
    label: string
}
export function SimpleCheckbox<T extends object>({data, field, updater, label}: SimpleCheckboxArgs<T>) {
    let v = field.in(data)
    let setThing = useMemo(()=>updater.field(field), [updater, field])
    let onChange = useCallback((e)=>setThing.set(e.target.checked), [updater, field])
    return <FormControlLabel control={<Checkbox checked={v} onChange={onChange} />} label={label} />
}
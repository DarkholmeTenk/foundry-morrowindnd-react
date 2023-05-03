import {FieldProps} from "Util/Components/Input/FieldData";
import {LabeledField} from "Util/Components/Input/LabeledField";

interface Props<V> {
    values: V[]
    value: V
    setValue: (v: V)=>void
    labelFunction?: (v: V)=>string
    includeNull?: boolean
    label?: string
}
export default function Selector<T>({values, value, setValue, labelFunction=(s)=>`${s}`, includeNull=true, label=""}: Props<T>) {
    let map = {}
    values.forEach((v)=>{
        let label = labelFunction(v)
        if(map[label]) throw Error("Value already exists for " + label + " - " + v)
        map[label] = v
    })
    let selected = !value ? "" : labelFunction(value)
    return <select value={selected} onChange={(e)=>setValue(map[e.target.value])} aria-label={label}>
        {includeNull ? <option value="" /> : null}
        {values.map((v)=>{
            let label = labelFunction(v)
            return <option key={label} value={label}>{label}</option>
        })}
    </select>
}

type SFieldProps<T> = FieldProps<T> & Omit<Props<T>, "value" | "setValue" | "label">
export function SelectorField<T>({values, value, setter, labelFunction=(s)=>""+s, label, includeNull=false}: SFieldProps<T>) {
    return <LabeledField label={label}>
        <Selector values={values} value={value} setValue={setter} labelFunction={labelFunction} includeNull={includeNull} />
    </LabeledField>
}
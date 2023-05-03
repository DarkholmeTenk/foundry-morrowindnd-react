import {FieldProps} from "Util/Components/Input/FieldData";
import {LabeledField} from "Util/Components/Input/LabeledField";

export function StringField({value, setter, label}: FieldProps<string>) {
    return <LabeledField label={label}>
        <input value={value} onChange={(e)=>setter(e.target.value)}/>
    </LabeledField>
}

export function IntField({value, setter, label}: FieldProps<number>) {
    return <LabeledField label={label}>
        <input value={value} onChange={(e)=>setter(Math.floor(e.target.valueAsNumber))}/>
    </LabeledField>
}

export function FloatField({value, setter, label}: FieldProps<number>) {
    return <LabeledField label={label}>
        <input value={value} onChange={(e)=>setter(e.target.valueAsNumber)}/>
    </LabeledField>
}
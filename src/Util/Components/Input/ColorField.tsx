import {FieldProps} from "Util/Components/Input/FieldData";
import {ChangeEvent} from "react";
import {LabeledField} from "Util/Components/Input/LabeledField";
import Styles from "./Input.module.scss"

function toHex(n: number): string {
    let v = n.toString(16)
    if(v.length === 1) return "0" + v
    return v
}

export function ColorField({value, setter, label}: FieldProps<number>) {
    let r = (0xFF0000 & value) >> 16
    let g = (0x00FF00 & value) >> 8
    let b = (0x0000FF & value)
    let set = (mask: number, shift: number) => {
        return (e: ChangeEvent<HTMLInputElement>)=>{
            let x = parseInt(e.target.value)
            setter(old=>{
                let withoutMask = (old & ~mask)
                let shiftedX = (x << shift) & mask
                return withoutMask | shiftedX
            })
        }
    }
    let hexCss = "#" + toHex(r) + toHex(g) + toHex(b)
    return <LabeledField label={label}>
        <span className={Styles.ColorSpan}>
            <input className={Styles.r} value={r} onChange={set(0xFF0000, 16)}/>
            <input className={Styles.g} value={g} onChange={set(0x00FF00, 8)}/>
            <input className={Styles.b} value={b} onChange={set(0x0000FF, 0)}/>
            <span className={Styles.ColorBlock} style={{backgroundColor: hexCss}} />
        </span>
    </LabeledField>
}
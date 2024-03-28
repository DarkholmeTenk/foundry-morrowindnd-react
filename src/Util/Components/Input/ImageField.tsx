import {FieldProps} from "Util/Components/Input/FieldData";
import {LabeledField} from "Util/Components/Input/LabeledField";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import Styles from "./Input.module.scss"

export function ImageField({value, setter, label}: FieldProps<string | undefined>) {
    let browse = ()=>{
        new FilePicker({current: value, callback: (x)=>setter(x), type: "image"}).render(true)
    }
    return <LabeledField label={label}>
        <span className={Styles.ImageSpan}>
            {value && <img src={value} style={{width: "24px", height: "24px"}} alt={label} />}
            <input type="text" value={value ?? ""} onChange={(e)=>setter(e.target.value)}/>
            <Button onClick={browse}>Browse</Button>
        </span>
    </LabeledField>
}
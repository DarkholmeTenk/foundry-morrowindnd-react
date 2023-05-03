import {PropsWithChildren} from "react";
import Styles from "./Input.module.scss"

export function LabeledField({children, label}: PropsWithChildren<{ label: string }>) {
    return <div className={Styles.Labeled}>
        <span className={Styles.Label}>{label}</span>
        {children}
    </div>
}
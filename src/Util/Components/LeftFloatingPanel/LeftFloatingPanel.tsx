import Styles from "./LeftFloatingPanel.module.scss"
import {PropsWithChildren, useState} from "react";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

interface Props {
    canClose?
}
export function LeftFloatingPanel({children}: PropsWithChildren<any>) {
    let [open, setOpen] = useState(false)
    if(open) {
        return <div className={Styles.LeftFloatingPanel}>
            <span className={Styles.CloseIcon}>
                <Button icon="fas fa-folder-open" onClick={() => setOpen(false)}/>
            </span>
            {children}
        </div>
    } else {
        return <div className={Styles.LeftFloatingPanel}>
            <Button icon="fas fa-folder-closed" onClick={() => setOpen(true)}/>
        </div>
    }
}
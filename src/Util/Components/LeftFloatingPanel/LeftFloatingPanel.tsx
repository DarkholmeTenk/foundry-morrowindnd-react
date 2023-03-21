import Styles from "./LeftFloatingPanel.module.scss"
import {PropsWithChildren} from "react";

export function LeftFloatingPanel({children}: PropsWithChildren<any>) {
    return <div className={Styles.LeftFloatingPanel}>
        {children}
    </div>
}
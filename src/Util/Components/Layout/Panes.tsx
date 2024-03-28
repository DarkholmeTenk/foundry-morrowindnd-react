import Styles from "./Panes.module.scss"
import {PropsWithChildren} from "react";

export function PaneView({children}: PropsWithChildren<{}>) {
    return <div className={Styles.Panes}>
        {children}
    </div>
}

export function LeftPane({children}: PropsWithChildren<{}>) {
    return <div className={Styles.LeftPane}>
        {children}
    </div>
}

export function LeftPaneList({children}: PropsWithChildren<{}>) {
    return <div className={Styles.List}>
        <ul>
            {children}
        </ul>
    </div>
}

export function MainPane({children}: PropsWithChildren<{}>) {
    return <div className={Styles.MainPane}>
        {children}
    </div>
}


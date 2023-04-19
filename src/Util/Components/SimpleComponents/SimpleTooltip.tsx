import {ReactNode} from "react";
import {Tooltip as MUITooltip} from "@mui/material";

interface Props {
    text?: string | ReactNode | undefined,
    wrapSpan?: boolean
    children: JSX.Element
}
export function Tooltip({text, children, wrapSpan}: Props) {
    if(!children) return null
    if(text) {
        let c = wrapSpan ? <span>{children}</span> : children
        return <MUITooltip title={text}>
            {c}
        </MUITooltip>
    } else {
        return children
    }
}
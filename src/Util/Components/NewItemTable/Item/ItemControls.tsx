import React, {ReactNode} from "react";
import {Tooltip} from "@mui/material";

export function ItemControl({title, icon, onClick}: {title: string, icon: string | ReactNode, onClick: ()=>void}) {
    let iconElem = typeof icon === "string" ? <i className={icon} /> : icon
    return <Tooltip title={title}>
        <a className={`item-control $classes`} onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onClick()
        }}>
            {iconElem}
        </a>
    </Tooltip>
}
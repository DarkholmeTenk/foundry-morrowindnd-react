import React, {useCallback} from "react";
import {Tooltip} from "@material-ui/core";

interface IconButtonArgs {
    title?: string,
    clz: string,
    onClick: ()=>any,
    classes?: string
}
export default function IconButton({title, clz, onClick, classes}: IconButtonArgs) {
    let click = useCallback((e)=>{
        e.preventDefault()
        e.stopPropagation()
        onClick()
    }, [onClick])
    let className = "item-control " + (classes || "")
    return <Tooltip title={title || ""}>
        <a className={className} onClick={click}>
            <i className={clz} />
        </a>
    </Tooltip>
}
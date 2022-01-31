import React from "react";
import {ReactNodeLike} from "prop-types";
import {Column, ColumnArguments} from "./ItemTable";
import {usePromise} from "../../Helper/PromiseHelper";
import {CircularProgress, Tooltip} from "@material-ui/core";

type ControlGetter = (columnArgs: ColumnArguments) => Control[] | Promise<Control[]>

export interface Control {
    title: string,
    classes?: string,
    text: ReactNodeLike,
    onClick: () => void
}

interface ItemControlArgs {
    control: Control
}
export function ItemControl({control: {title, onClick, text, classes}}: ItemControlArgs) {
    return (
        <Tooltip title={title}>
            <a className={`item-control $classes`} onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onClick()
            }}>
                {text}
            </a>
        </Tooltip>
    )
}

export function getEditControl(item: Item): Control {
    return {
        title: "Edit Item",
        classes: "item-edit",
        text: <i className="fas fa-edit"/>,
        onClick: () => item.sheet!.render(true, {editable: item.isOwner} as any)
    }
}

export function generateControlsColumn(controlGetter: ControlGetter, dependants?: any[]): Column {
    return {
        title: "",
        getter: (columnArgs) => <ItemControls controls={controlGetter} args={columnArgs} dependants={dependants || []}/>
    }
}

interface ItemControlsArgs {
    controls: ControlGetter,
    dependants: any[],
    args: ColumnArguments
}

function ItemControls({controls, args, dependants}: ItemControlsArgs) {
    let {result, loading} = usePromise(async ()=>controls(args), dependants)
    if(loading || !result) {
        return <CircularProgress />
    } else {
        let buttons = result.map((control, id) =>
            <ItemControl control={control} key={id}/>
        )

        return <div className="item-controls flexrow">
            {buttons}
        </div>
    }
}
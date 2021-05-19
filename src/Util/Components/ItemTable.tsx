import React, {Fragment, useCallback, useState} from "react"
import {Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import GoldDisplay from "./GoldDisplay";
import ItemDescription from "./ItemDescription";
import {ReactNodeLike} from "prop-types";

type ControlGetter = (columnArgs: ColumnArguments) => Control[]
export interface ColumnArguments {
    item: Item<any>,
    index: number,
    toggleDescriptionPanel: ()=>void
}

export interface Column {
    title: string,
    getter: (columnArgs: ColumnArguments) => ReactNodeLike
}

export const ItemColumnImage: Column = {
    title: "",
    getter: ({item: i})=><img width="24px" height="24px" src={i.img} />
}
export const ItemColumnName: Column = {
    title: "Name",
    getter: ({item: i})=>i.name
}
export const ItemColumnWeight: Column = {
    title: "Weight",
    getter: ({item: i})=>NumberFormat.format(i.data.data.weight)
}
export const ItemColumnQty: Column = {
    title: "Qty",
    getter: ({item: i})=>i.data.data.quantity
}

export const ItemColumnDefaults: Column[] = [ItemColumnImage, ItemColumnName, ItemColumnWeight, ItemColumnQty]

export const NumberFormat = new Intl.NumberFormat('en', {maximumSignificantDigits: 2})

export interface Control {
    title: string,
    classes?: string,
    text: ReactNodeLike,
    onClick: ()=>void
}

interface ItemControlArgs { control: Control }
function ItemControl({control: {title, onClick, text, classes}}: ItemControlArgs) {
    return (
        <a className={`item-control $classes`} title={title} onClick={(e)=>{
            e.stopPropagation()
            e.preventDefault()
            onClick()
        }}>
            {text}
        </a>
    )
}

export function getEditControl(item: Item<any>): Control {
    return {
        title: "Edit Item",
        classes: "item-edit",
        text: <i className="fas fa-edit"/>,
        onClick: ()=>item.sheet.render(true, {editable: item.owner} as any)
    }
}

export function generateControlsColumn(controlGetter: ControlGetter): Column {
    return {
        title: "",
        getter: (columnArgs) => <ItemControls controls={controlGetter(columnArgs)}/>
    }
}

interface ItemControlsArgs {controls: Control[]}
function ItemControls({controls}: ItemControlsArgs) {

    let buttons = controls.map((control, id)=>
        <ItemControl control={control} key={id} />
    )

    return <div className="item-controls flexrow">
        {buttons}
    </div>
}

interface ItemTableRowArguments {
    item: Item<any>,
    columns: Column[],
    index: number
}
export function ItemTableRow({item, columns, index}: ItemTableRowArguments) {
    let [open, setOpen] = useState(false)
    let toggleOpen = useCallback(()=>setOpen(x=>!x), [])
    let columnArgs = {item, index, toggleDescriptionPanel: toggleOpen}
    return <Fragment>
        <TableRow onClick={toggleOpen}>
            {columns.map((c,i)=><TableCell key={i}>{c.getter(columnArgs)}</TableCell>)}
        </TableRow>
        <TableRow onClick={toggleOpen}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length} >
                <Collapse in={open} unmountOnExit>
                    <ItemDescription description={item.data?.data?.description?.value || "No Description found"} />
                </Collapse>
            </TableCell>
        </TableRow>
    </Fragment>
}


interface ItemTableArguments {
    items: Item<any>[],
    columns: Column[],
}

export default function ItemTable({items, columns}: ItemTableArguments) {
    return <TableContainer>
        <Table size="small">
            <TableHead>
                <TableRow>
                    {columns.map((c,i)=><TableCell key={i}>{c.title}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map((item, index)=>
                    <ItemTableRow key={item.id} {...{item, index, columns}}/>)
                }
            </TableBody>
        </Table>
    </TableContainer>
}
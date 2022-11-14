import {TableColumn} from "./TableColumn";
import {Button, TableCell, TableRow} from "@material-ui/core";
import React, {useCallback, useState} from "react";
import {ItemExpander, ItemExpanderComponent} from "./NewItemTableExpander";
import {StateSetter} from "../../React/update/Updater";

function ExpandCell({expanded, setExpanded}: {expanded: boolean, setExpanded: StateSetter<boolean>}) {
    let toggle = useCallback(()=>setExpanded(prev=>!prev), [setExpanded])
    return <TableCell padding="none">
        <Button style={{minWidth: '32px'}} variant="text" size="small" onClick={toggle} >{expanded ? "[-]" : "[+]"}</Button>
    </TableCell>
}

interface NewItemTableRowProps<T, D> {
    item: T,
    extraData: D,
    expander?: ItemExpander<T, D>
    columns: TableColumn<D, T>[]
}
export function NewItemTableRow<T, D>({item, extraData, columns, expander}: NewItemTableRowProps<T, D>) {
    let [expanded, setExpanded] = useState(false)
    return <>
        <TableRow>
            {expander && <ExpandCell expanded={expanded} setExpanded={setExpanded} />}
            {columns.map((c,i)=>{
                let ColumnComponent = c.ColumnComponent
                return <TableCell padding="none" key={i}>
                    <ColumnComponent item={item} {...extraData} />
                </TableCell>
            })}
        </TableRow>
        <TableRow style={{display: expanded ? undefined : 'none'}}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1} >
                <ItemExpanderComponent item={item} data={extraData} Expander={expander} />
            </TableCell>
        </TableRow>
    </>
}
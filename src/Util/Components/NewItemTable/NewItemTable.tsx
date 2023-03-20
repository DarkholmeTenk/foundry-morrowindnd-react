import React, {FunctionComponent} from "react";
import {ItemTableFilter, useFilter} from "./NewItemTableFilters";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Styles from "./NewItemTable.module.scss";
import {usePagination} from "./NewItemTablePagination";
import {TableColumn} from "./TableColumn";
import {NewItemTableRow} from "./NewItemTableRow";
import {ItemExpander} from "./NewItemTableExpander";

interface NewItemTableProps<D, T, Q> {
    extraData: D
    filter?: ItemTableFilter<T, Q>
    columns: TableColumn<D, T>[],
    expander?: ItemExpander<T, D>
    items: T[],
    actions?: FunctionComponent
}
export function NewItemTable<D, T, Q>({extraData, columns, items, filter, expander, actions: Actions}: NewItemTableProps<D, T, Q>) {
    let { filtered, FilterComponent } = useFilter({items, filter})
    let { sliced, PaginationComponent } = usePagination({items: filtered})
    let actionComp = Actions ? <Actions /> : null
    return <div>
        <div style={{all: 'initial'}}>
            {FilterComponent}
            <TableContainer className={Styles.itemTable}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {expander && <TableCell />}
                            {columns.map((c,i)=><TableCell key={i}>{c.label}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sliced.map((item, index)=>
                            <NewItemTableRow key={index} item={item} columns={columns} extraData={extraData} expander={expander}/>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={Styles.ActionContainer}>
                { actionComp }
                <div />
                { PaginationComponent }
            </div>
        </div>
    </div>
}
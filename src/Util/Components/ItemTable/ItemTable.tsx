import React, {Fragment, useCallback, useMemo, useState} from "react"
import {
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import ItemDescription from "../ItemDescription";
import {ReactNodeLike} from "prop-types";
import {Filter, generateFilterFunction, ItemTableFilter} from "./ItemTableFilter";
import Styles from "./ItemTable.module.scss"

export interface ColumnArguments {
    item: Item<any>,
    index: number,
    toggleDescriptionPanel: ()=>void
}

export interface Column {
    title: string,
    getter: (columnArgs: ColumnArguments) => ReactNodeLike,
    sortable?: boolean
}

export const NumberFormat = new Intl.NumberFormat('en', {maximumSignificantDigits: 2})

interface ItemTableRowArguments {
    item: Item<any>,
    columns: Column[],
    index: number,
    extraProps: any
}
export function ItemTableRow({item, columns, index, extraProps}: ItemTableRowArguments) {
    let [open, setOpen] = useState(false)
    let toggleOpen = useCallback(()=>setOpen(x=>!x), [])
    let columnArgs = {item, index, toggleDescriptionPanel: toggleOpen}
    return <Fragment>
        <TableRow onClick={toggleOpen}>
            {columns.map((c,i)=><TableCell padding="none" key={i}>{c.getter(columnArgs)}</TableCell>)}
        </TableRow>
        <TableRow onClick={toggleOpen}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length} >
                <Collapse in={open} unmountOnExit>
                    <div style={{display: 'none'}}>{JSON.stringify(extraProps)}</div>
                    <ItemDescription description={item.data?.data?.description?.value || "No Description found"} />
                </Collapse>
            </TableCell>
        </TableRow>
    </Fragment>
}

interface ItemTableArguments {
    items: Item<any>[],
    columns: Column[],
    extraProps?: any
}
export default function ItemTable({items, columns, extraProps}: ItemTableArguments) {
    let [filterData, setFilterData] = useState<Partial<Filter>>({})
    let filter = items.length > 1 ? generateFilterFunction(filterData) : ()=>true
    let [page, setPage] = React.useState(0);
    let [rowsPerPage, setRowsPerPage] = React.useState(20);
    let filtered = useMemo(()=>items.filter(filter), [items, filter])
    let handleChangePage = useCallback((e,p)=>setPage(p), [setPage])
    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }, [setRowsPerPage, setPage]);

    return <div style={{all: 'initial'}}>
        {items.length > 1 ? <ItemTableFilter items={items} filter={filterData} setFilter={setFilterData} /> : null}
        <TableContainer className={Styles.itemTable}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columns.map((c,i)=><TableCell key={i}>{c.title}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index)=>
                        <ItemTableRow key={item.id} {...{item, index, columns, extraProps}}/>)
                    }
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 20, 40, 100]}
                component="div"
                count={filtered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </TableContainer>
    </div>
}
import {Fragment, useCallback, useState} from "react"
import {Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import GoldDisplay from "./GoldDisplay";
import ItemDescription from "./ItemDescription";

const DEFAULT_COLUMNS = [
    {
        title: "",
        getter: (i)=><img width="24px" height="24px" src={i.img} />
    }, {
        title: "Name",
        getter: (i)=>i.name
    }, {
        title: "Weight",
        getter: (i)=>NumberFormat.format(i.data.data.weight)
    }, {
        title: "Qty",
        getter: (i)=>i.data.data.quantity
    }
]

const CONTROL_COLUMN = {
    title: "",
    getter: (i, c, _, index) =><ItemControls item={i} controls={c} index={index} />
}

export const NumberFormat = new Intl.NumberFormat('en', {maximumSignificantDigits: 2})

function ItemControls({item, controls = ()=>[], index}) {
    let allControls = [
        {
            title: "Edit Item",
            classes: "item-edit",
            text: <i className="fas fa-edit"></i>,
            onClick: ()=>item.sheet.render(true, {editable: item.owner})
        },
        ...controls(item, index)
    ]

    return <div className="item-controls flexrow">
        {allControls.map(({classes, title, onClick, text}, id)=>(
            <a key={id} className={`item-control $classes`} title={title} onClick={(e)=>{
                e.stopPropagation()
                e.preventDefault()
                onClick()
            }}>
                {text}
            </a>))
        }
    </div>
}

export function ItemTableRow({item, columns, controls, index}) {
    let [open, setOpen] = useState(false)
    let toggleOpen = useCallback(()=>setOpen(x=>!x))
    return <Fragment>
        <TableRow onClick={toggleOpen}>
            {columns.map((c,i)=><TableCell key={i}>{c.getter(item, controls, toggleOpen, index)}</TableCell>)}
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

export function ItemTable({items, extraColumns, controls}) {
    let columns = [...DEFAULT_COLUMNS, ...(extraColumns || []), CONTROL_COLUMN]
    return <TableContainer>
        <Table size="small">
            <TableHead>
                <TableRow>
                    {columns.map((c,i)=><TableCell key={i}>{c.title}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map((item, index)=><ItemTableRow key={item.id} item={item} columns={columns} index={index} controls={controls}/>)}
            </TableBody>
        </Table>
    </TableContainer>
}
import React, {useRef, useState} from "react";
import {Button, Input, MenuItem, MenuList, Popover} from "@material-ui/core";
import Styles from "./ComplexSelector.module.scss"

function ComplexSelectorMenu<T>({values, setValue, displayComponent: DisplayComponent, nameFunction}: Omit<Props<T>, "text">) {
    let [nameFilter, setFilter] = useState("")
    let filtered = (nameFunction && nameFilter) ? values.filter(x=>nameFunction(x).toLowerCase().includes(nameFilter.toLowerCase())) : values
    return <>
        {nameFunction && <Input title="Filter" value={nameFilter} onChange={(e)=>setFilter(e.target.value)} /> }
        <MenuList>
            {filtered.map((item, key)=><MenuItem onClick={(e)=>setValue(item)} key={key}>
                <DisplayComponent item={item} />
            </MenuItem>)}
        </MenuList>
    </>
}

type DisplayComponent<T> = (props: {item: T})=>JSX.Element
interface Props<T> {
    text: JSX.Element,
    values: T[]
    setValue: (newValue: T)=>unknown
    displayComponent: DisplayComponent<T>
    nameFunction?: (item: T)=>string
}
export function ComplexSelector<T>({text, values, setValue, displayComponent, nameFunction}: Props<T>) {
    let ref = useRef<any>()
    let [isOpen, setOpen] = useState(false)
    let select = (newValue: T)=>{
        setValue(newValue)
        setOpen(false)
    }
    return <React.Fragment>
        <Button onClick={()=>setOpen(true)} ref={ref}>{text}</Button>
        <Popover className={Styles.PopoverMenu} open={isOpen} anchorEl={ref.current} onClose={()=>setOpen(false)}>
            <ComplexSelectorMenu values={values} setValue={select} displayComponent={displayComponent} nameFunction={nameFunction} />
        </Popover>
    </React.Fragment>
}
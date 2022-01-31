import React, {useCallback} from "react";
import {
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    TextField, Tooltip
} from "@material-ui/core";
import IconButton from "../IconButton";
import {ItemTypes, SpellSchools} from "./ItemTypes";
import Styles from "./ItemTableFilter.module.scss"

export interface Filter {
    name: string,
    itemTypes: Record<string, boolean>,
    spellTypes: Record<string, boolean>
}

function toggle(filter: Partial<Filter>, key: string, t: string): Partial<Filter> {
    return {
        ...filter,
        [key]: {
            ...(filter[key] || {}),
            [t]: !(filter[key] || {})[t]
        }
    }
}

function toggleItemType(filter: Partial<Filter>, t: string): Partial<Filter> {
    return toggle(filter, "itemTypes", t)
}

function toggleSpellType(filter: Partial<Filter>, t: string): Partial<Filter> {
    return toggle(filter, "spellTypes", t)
}

function TypeControl({type, types, filterTypes, toggle}) {
    let {icon, name} = types[type]
    let selected = !(filterTypes || {})[type]
    let clz = selected ? icon : `${icon} ${Styles.disabled}`
    let onClick = useCallback(()=>toggle(type), [toggle, type])
    return <Tooltip title={name}><IconButton clz={clz} onClick={onClick} /></Tooltip>
}
function TypeControls({types, allTypes, value, toggle, id}) {
    let controls = types.map(x=><TypeControl types={allTypes} key={x} type={x} filterTypes={value} toggle={toggle} /> )
    return <div id={id}>{controls}</div>
}

function ItemTypeControlsContainer({items, filter, setFilter}) {
    let toggle = useCallback((t) => setFilter((f)=>toggleItemType(f, t)), [setFilter])
    let types = Object.keys(ItemTypes)
        .filter(type=>items.some(i=>i.type === type))
    if(types.length <= 1) {
        return null
    } else {
        return <FormControl style={{flexGrow: 0, minWidth: '150px'}}>
            <InputLabel focused shrink>Item Types</InputLabel>
            <Input disableUnderline inputComponent={TypeControls} inputProps={{types, toggle, allTypes: ItemTypes}} value={filter.itemTypes} style={{height: '100%'}}/>
        </FormControl>
    }
}

function SpellTypeControlContainer({items, filter, setFilter}) {
    let toggle = useCallback((t)=>setFilter((f)=>toggleSpellType(f, t)), [setFilter])
    let types = Object.keys(SpellSchools)
        .filter(type=>items.some(i=>i.type === "spell" && i.data.data.school === type))
    if(types.length <= 1) {
        return null
    } else {
        return <FormControl style={{flexGrow: 0, minWidth: '150px'}}>
            <InputLabel focused shrink>Spell Schools</InputLabel>
            <Input disableUnderline inputComponent={TypeControls} inputProps={{types, toggle, allTypes: SpellSchools}} value={filter.spellTypes} style={{height: '100%'}}/>
        </FormControl>
    }
}

interface ItemTableFilterArgs {
    items: Item[],
    filter: Partial<Filter>
    setFilter: (reducer: (f: Partial<Filter>)=>Partial<Filter>)=>void
}
export function ItemTableFilter({items, filter, setFilter}: ItemTableFilterArgs) {
    let setName = useCallback((e) => setFilter(f => ({...f, name: e.target.value})), [setFilter])
    let clearName = useCallback(() => setFilter(f => ({...f, name: ""})), [setFilter])
    return <div className="flexrow">
        <TextField style={{flexGrow: 1}} label="Filter" value={filter?.name || ""} onChange={setName} InputProps={{
            endAdornment: filter.name &&
                <InputAdornment position="end"><IconButton clz="fas fa-backspace" onClick={clearName}/></InputAdornment>
        }}/>
        <ItemTypeControlsContainer items={items} filter={filter} setFilter={setFilter} />
        <SpellTypeControlContainer items={items} filter={filter} setFilter={setFilter} />
    </div>
}

type FilterFunction = (item: Item) => boolean
export function generateFilterFunction(filter: Partial<Filter>): FilterFunction {
    let filters: FilterFunction[] = []
    if(filter.name)
        filters.push((i)=>i.name!.toLowerCase().includes(filter.name!.toLowerCase()))
    if(filter.itemTypes)
        filters.push((i)=>!filter.itemTypes![i.type])
    if(filter.spellTypes)
        filters.push((i)=>i.type !== "spell" || !filter.spellTypes![i.spell().school])
    return (item)=>filters.every(f=>f(item))
}
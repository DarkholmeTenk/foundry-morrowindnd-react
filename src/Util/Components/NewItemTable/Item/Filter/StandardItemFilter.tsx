import React, {useCallback} from "react";
import {InputAdornment, TextField} from "@mui/material";
import IconButton from "../../../IconButton";
import {ItemTypes, SpellSchools} from "../../ItemTypes";
import {StateSetter} from "Util/React/update/Updater";
import {ItemTableFilter} from "../../NewItemTableFilters";
import {ItemTypeControlsContainer, mapItemTypeRecord, useTypeState} from "./TypeFilter";

export type ItemFilterState = Partial<{
    name: string,
    itemTypes: Record<string, boolean>,
    spellTypes: Record<string, boolean>
}>
const getSchool = (i: Item5e | SmartItemData) => i.type === "spell" ? i.system.school : ""
const schoolTypes = mapItemTypeRecord(SpellSchools)
const getType = (i: Item5e | SmartItemData) => i.type
const itemTypes = mapItemTypeRecord(ItemTypes)

interface TypeControlProps {
    items: Item5e[] | SmartItemData[]
    filter: any,
    setFilter: any
}
function ItemTypeControls({items, filter, setFilter}: TypeControlProps) {
    let [state, updateState] = useTypeState(filter, setFilter, "itemTypes")
    return <ItemTypeControlsContainer items={items} typeGetter={getType} types={itemTypes} label="Item Types" state={state} updateState={updateState} />
}

function SpellTypeControls({items, filter, setFilter}: TypeControlProps) {
    let [state, updateState] = useTypeState(filter, setFilter, "spellTypes")
    return <ItemTypeControlsContainer items={items} typeGetter={getSchool} types={schoolTypes} label="Spell Schools" state={state} updateState={updateState} />
}

function NameFilter({state, setState}: Pick<ItemTableFilterArgs, "state" | "setState">) {
    let setName = useCallback((e) => setState(f => ({...f, name: e.target.value})), [setState])
    let clearName = useCallback(() => setState(f => ({...f, name: ""})), [setState])
    return (
        <TextField style={{flexGrow: 1}} label="Filter" value={state.name || ""} onChange={setName} InputProps={{
            endAdornment: state.name &&
                <InputAdornment position="end"><IconButton clz="fas fa-backspace" onClick={clearName} size="large" /></InputAdornment>
        }}/>
    );
}

interface ItemTableFilterArgs {
    items: Item5e[] | SmartItemData[],
    state: ItemFilterState
    setState: StateSetter<ItemFilterState | undefined>
}
export function ItemTableFilterComp({items, state, setState}: ItemTableFilterArgs) {
    return <div className="flexrow">
        <NameFilter state={state} setState={setState} />
        <ItemTypeControls items={items} filter={state} setFilter={setState} />
        <SpellTypeControls items={items} filter={state} setFilter={setState} />
    </div>
}

export const StandardItemFilter: ItemTableFilter<Item5e, ItemFilterState> = {
    defaultState: {},
    FilterComponent: ItemTableFilterComp,
    generateFilter: generateFilterFunction
}

type FilterFunction = (item: Item5e | SmartItemData) => boolean
export function generateFilterFunction(filter: ItemFilterState): FilterFunction {
    let filters: FilterFunction[] = []
    if(filter.name) {
        let lc = filter.name.toLowerCase()
        filters.push((i) => i.name!.toLowerCase().includes(lc))
    }
    if(filter.itemTypes)
        filters.push((i)=>!filter.itemTypes![i.type])
    if(filter.spellTypes)
        filters.push((i)=>i.type !== "spell" || !filter.spellTypes![i.system.school])
    return (item)=>filters.every(f=>f(item))
}
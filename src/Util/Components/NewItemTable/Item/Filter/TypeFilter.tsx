import React, {useCallback} from "react";
import {FormControl, Input, InputLabel, Tooltip} from "@material-ui/core";
import Styles from "./ItemFilter.module.scss";
import IconButton from "../../../IconButton";
import {StateSetter} from "../../../../React/update/Updater";

export function mapItemTypeRecord(x: Record<string, {name: string, icon: string}>): ItemType[] {
    return Object.keys(x).map(id=>({...x[id], id}))
}

type TypeFilterState = Record<string, boolean>
type Updater = (reducer: (old: TypeFilterState)=>TypeFilterState)=>void
interface ItemType {
    id: string,
    name: string,
    icon: string
}

function toggle(old: TypeFilterState, key: string): TypeFilterState {
    return {
        ...old,
        [key]: !old[key]
    }
}

function TypeControl({type: {icon, name, id}, state, toggleState}: {type: ItemType, state: TypeFilterState, toggleState: (t)=>void}) {
    let selected = !state[id]
    let clz = selected ? icon : `${icon} ${Styles.disabled}`
    let onClick = useCallback(()=>toggleState(id), [toggle, id])
    return <Tooltip title={name}><IconButton clz={clz} onClick={onClick} /></Tooltip>
}

function TypeControls({types, value, toggleMe, id}: {types: ItemType[], value: TypeFilterState, toggleMe: (t: string)=>void, id: string}) {
    let controls = types.map(x=><TypeControl key={x.id} type={x} state={value} toggleState={toggleMe} /> )
    return <div id={id}>{controls}</div>
}

interface ItemTypeControlsArgs {
    label: string,
    items: Item[],
    typeGetter: (i: Item)=>string
    types: ItemType[],
    state: TypeFilterState
    updateState: Updater
}
export function ItemTypeControlsContainer({items, typeGetter, types, state, updateState}: ItemTypeControlsArgs) {
    let toggleMe = useCallback((key: string) => updateState((old)=>toggle(old, key)), [updateState])
    let visibleTypes = types.filter(type=>items.some(i=>typeGetter(i) === type.id))
    if(visibleTypes.length <= 1) {
        return null
    } else {
        return <FormControl style={{flexGrow: 0, minWidth: '150px'}}>
            <InputLabel focused shrink>Item Types</InputLabel>
            <Input disableUnderline inputComponent={TypeControls} inputProps={{types: visibleTypes, toggleMe}} value={state} style={{height: '100%'}}/>
        </FormControl>
    }
}

export function useTypeState<Q extends object>(x: Q, setter: StateSetter<Partial<Q> | undefined>, key: string): [TypeFilterState, Updater] {
    let existing = x[key] || {}
    let update = useCallback((r: (TypeFilterState)=>TypeFilterState)=>{
        setter(old=>{
            let oldObj = old ?? {}
            let oldVal = oldObj[key] ?? {}
            return {
                ...oldObj,
                [key]: r(oldVal)
            }
        })
    }, [setter])
    return [existing, update]
}
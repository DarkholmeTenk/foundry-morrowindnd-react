import {callUpdater, StateSetter, UpdateCallback} from "../React/update/Updater";
import {useCallback} from "react";

export type Adder<T> = (newValue: T | T[])=>void
export type Remover = (slot: number)=>void
export type Updater<T> = {
    (slot: number, newValue: T | UpdateCallback<T>): void,
    forSlot: (slot: number) => StateSetter<T>
}
export function useArrayRemover<T>(setter: StateSetter<T[]>): Remover {
    return useCallback((slot: number)=>{
        setter(original=>{
            let newArray = [...original]
            newArray.splice(slot, 1)
            return newArray
        })
    }, [setter])
}

export function useArrayAdder<T>(setter: StateSetter<T[]>): Adder<T> {
    return useCallback((newValue)=>{
        let x = Array.isArray(newValue) ? newValue : [newValue]
        setter((original)=>[...original, ...x])
    }, [setter])
}

export function useArrayUpdater<T>(setter: StateSetter<T[]>): Updater<T> {
    let x = (slot, newValue)=>{
        setter((original)=>{
            let newTables = [...original]
            let oldValue = newTables[slot]
            newTables[slot] = callUpdater(oldValue, newValue)
            return newTables
        })
    }
    let v: Updater<T> = x as Updater<T>
    v.forSlot = (slot)=>(x)=>v(slot, x)
    return v
}

export function useArrayReducers<T>(setter: StateSetter<T[]>): [update: Updater<T>, adder: Adder<T>, remover: Remover] {
    let update = useArrayUpdater(setter)
    let adder = useArrayAdder(setter)
    let remover = useArrayRemover(setter)
    return [update, adder, remover]
}

type Enabler<T> = (value: T)=>void
type Disabler<T> = Enabler<T>
export function useArrayEnable<T>(setter: StateSetter<T[]>): Enabler<T> {
    return (newValue: T)=>{
        setter((oldArray)=>{
            if(oldArray.includes(newValue)) return oldArray
            return [...oldArray, newValue]
        })
    }
}

export function useArrayDisable<T>(setter: StateSetter<T[]>): Disabler<T> {
    return (removedValue: T)=>{
        setter((oldArray)=>{
            if(!oldArray.includes(removedValue)) return oldArray
            return oldArray.filter(x=>x !== removedValue)
        })
    }
}

export function useArrayEnableDisable<T>(setter: StateSetter<T[]>): [Enabler<T>, Disabler<T>] {
    return [useArrayEnable(setter), useArrayDisable(setter)]
}
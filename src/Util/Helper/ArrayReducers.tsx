import {StateSetter} from "../React/update/Updater";
import {useCallback} from "react";

type Adder<T> = (newValue: T | T[])=>void
type Remover = (slot: number)=>void
type Updater<T> = (slot: number, newValue: T)=>void
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
    return useCallback((slot, newValue)=>{
        setter((original)=>{
            let newTables = [...original]
            newTables[slot] = newValue
            return newTables
        })
    }, [setter])
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
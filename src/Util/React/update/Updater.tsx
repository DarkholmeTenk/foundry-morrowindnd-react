import {Dispatch, SetStateAction, useCallback, useMemo} from "react";

export type UpdateCallback<T> = (oldValue: T)=>T
export interface BaseUpdater<T> {
    set: (newValue: T)=>void,
    update: (callback: UpdateCallback<T>)=>void
}

export type StateSetter<T> = Dispatch<SetStateAction<T>>
export function useStateUpdate<T>(setState: StateSetter<T>): BaseUpdater<T> {
    return useMemo(()=>({
        set: setState,
        update: setState
    }), [setState])
}

export function callUpdater<T>(oldValue: T, x: T | UpdateCallback<T>): T {
    if(typeof x === "function") {
        let u = x as UpdateCallback<T>
        return u(oldValue)
    } else {
        return x
    }
}

export function useMappedSetter<T, K extends keyof T, U extends T[K]>(key: K, set: StateSetter<T>): StateSetter<U> {
    return useCallback((x)=>{
        set((oldT)=>{
            let newT = {...oldT}
            newT[key] = callUpdater(oldT[key] as U, x)
            return newT
        })
    }, [set, key])
}

export function useSafeSetter<T>(set: StateSetter<T | undefined>, def: T): StateSetter<T> {
    return useCallback((x)=>{
        set((oldT)=>{
            let safeT = oldT ? oldT : def
            return callUpdater(safeT, x)
        })
    }, [set, def])
}

export function useSetter<T>(value: T, set: (newValue: T)=>unknown): StateSetter<T> {
    return useCallback((x)=>{
        set(callUpdater(value, x))
    }, [value, set])
}
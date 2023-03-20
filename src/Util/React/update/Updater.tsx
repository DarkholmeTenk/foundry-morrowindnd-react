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

export function useMappedSetter<T, K extends keyof T, U extends T[K]>(key: K, set: StateSetter<T>): StateSetter<U> {
    return useCallback((x)=>{
        set((oldT)=>{
            let newT = {...oldT}
            if(typeof x === "function") {
                let u = x as UpdateCallback<U>
                newT[key] = u(oldT[key] as U)
            } else {
                newT[key] = x
            }
            return newT
        })
    }, [set, key])
}

export function useSetter<T>(value: T, set: (newValue: T)=>unknown): StateSetter<T> {
    return useCallback((x)=>{
        if(typeof x === "function") {
            let u = x as UpdateCallback<T>
            set(u(value))
        } else {
            set(x)
        }
    }, [value, set])
}
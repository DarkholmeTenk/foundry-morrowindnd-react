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
import {useCallback, useMemo} from "react";
import {BaseUpdater, StateSetter, useStateUpdate} from "./Updater";

export interface InOut<T, U> {
    in: (t: T)=>U,
    out: (u: U)=>Partial<T>
}
export function useFieldInOut<T, U>(field: keyof T): InOut<T, U> {
    return useMemo(()=>{
        return {
            in: (t)=>t[field] as unknown as U,
            out: (u)=>({[field]: u} as unknown as Partial<T>)
        }
    }, [field])
}

type FieldUpdateGetter<T> = <U>(inOut: InOut<T, U>)=>BaseUpdater<U>
type FieldUpdateCallback<T extends object> = (original: T)=>Partial<T>
type FieldUpdate<T extends object> = (callback: FieldUpdateCallback<T>)=> void
export interface ObjectUpdater<T extends object> extends BaseUpdater<T>{
    updateField: FieldUpdate<T>,
    setField: (newPart: Partial<T>)=>void,
    field: FieldUpdateGetter<T>
}
export default function useStateObjectUpdater<T extends object>(setData: StateSetter<T>): ObjectUpdater<T> {
    let base = useStateUpdate(setData)
    return useObjectUpdater(base)
}

export function useObjectUpdater<T extends object>(updater: BaseUpdater<T>): ObjectUpdater<T> {
    let updateField = useCallback((callback)=>{
        updater.update(original=>{
            let newVal = {...original}
            Object.assign(newVal, callback(original))
            return newVal
        })
    }, [updater])
    let setField = useCallback((p)=>updateField(()=>p), [updateField])
    let field = useCallback((io)=>{
        return {
            set: (x)=>setField(io.out(x)),
            update: (x)=>updateField((o)=>io.out(x(io.in(o))))
        }
    }, [updateField, setField])
    return useMemo(()=>({
        ...updater,
        setField,
        updateField,
        field
    }), [updater, setField, updateField, field])
}

export function useNestedUpdater<T extends object, U extends object>(updater: ObjectUpdater<T>, inOut: InOut<T, U>): BaseUpdater<U> {
    return useMemo(()=>updater.field(inOut), [updater, inOut])
}
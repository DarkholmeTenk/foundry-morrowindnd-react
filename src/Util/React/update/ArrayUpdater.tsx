import {BaseUpdater} from "./Updater";
import {useCallback, useMemo} from "react";
import {InOut, ObjectUpdater} from "./ObjectUpdater";

export interface ArrayValueUpdater<T> extends BaseUpdater<T> {
    delete: ()=>void
}
export interface ArrayUpdater<T> extends BaseUpdater<T[]> {
    add: (newValue: T) => void,
    index: (index: number) => ArrayValueUpdater<T>
}
export function useArrayUpdater<T>(base: BaseUpdater<T[]>): ArrayUpdater<T> {
    let add = useCallback((newValue)=>{
        base.update(oldArr=>[...(oldArr || []), newValue])
    }, [base])
    let index = useCallback((index)=>{
        let update = (callback)=>base.update(oldArr=>{
            let newArr = [...oldArr]
            newArr[index] = callback(oldArr[index])
            return newArr
        })
        return {
            update,
            set: (newValue)=>update(()=>newValue),
            delete: ()=>base.update(oldArr=>{
                let newArr = [...oldArr]
                newArr.splice(index, 1)
                return newArr
            })
        }
    }, [base])
    return {
        ...base,
        add,
        index
    }
}

export function useArrayField<U extends object, T>(base: ObjectUpdater<U>, field: InOut<U, T[]>): ArrayUpdater<T> {
    let fieldUpdater = useMemo(()=>base.field(field), [base, field])
    return useArrayUpdater(fieldUpdater)
}
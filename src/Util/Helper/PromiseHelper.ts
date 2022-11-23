import {useEffect, useState} from "react";

export interface UsePromiseResult<T> {
    result: T | null
    loading: boolean
}
export function usePromise<T>(generator: ()=>Promise<T>, dependants?: any[]): UsePromiseResult<T> {
    let [loading, setLoading] =  useState(true)
    let [result, setResult] = useState<T | null>(null)
    useEffect(()=>{
        console.debug("Running promise", generator, dependants)
        setLoading(true)
        setResult(null)
        generator().then(r=>{
            setResult(r)
            setLoading(false)
        })
    }, dependants || [])
    return {loading, result}
}
import {useEffect, useState} from "react";

interface UsePromiseResult<T> {
    result?: T
    loading: boolean
}
export function usePromise<T>(generator: ()=>Promise<T>, dependants?: any[]): UsePromiseResult<T> {
    let [loading, setLoading] =  useState(true)
    let [result, setResult] = useState(undefined)
    useEffect(()=>{
        console.debug("Running promise", generator, dependants)
        setLoading(true)
        setResult(undefined)
        generator().then(r=>{
            setResult(r)
            setLoading(false)
        })
    }, dependants || [])
    return {loading, result}
}
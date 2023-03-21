import {useEffect, useReducer} from "react";

export function useForceUpdate(onChange?: ()=>void): ()=>void {
    const [value, forceUpdate] = useReducer((x) => x + 1, 0);
    useEffect(()=>{
        if(onChange) onChange()
    }, [onChange, value])
    return forceUpdate
}

export const useRefresh = useForceUpdate
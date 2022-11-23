import {useReducer} from "react";

export function useForceUpdate(): ()=>void {
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);
    return forceUpdate
}

export const useRefresh = useForceUpdate
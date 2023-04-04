import {DependencyList, useEffect} from "react";

export function useHook(hookName: string, callback: HookCallback, dependencies: DependencyList) {
    useEffect(()=>{
        let hookId = Hooks.on(hookName, callback)
        return ()=>Hooks.off(hookName, hookId)
    }, [hookName, dependencies])
}
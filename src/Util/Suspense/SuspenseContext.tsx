import {createContext, DependencyList, PropsWithChildren, useContext, useEffect, useRef} from "react";
import {SuspenseCache} from "Util/Suspense/SuspenseCache";
import {useRefresh} from "Util/Helper/useForceUpdate";

const Ctx = createContext<SuspenseCache>(null!)

export function SuspenseContext({children}: PropsWithChildren<{}>) {
    let refresh = useRefresh()
    let ref = useRef<SuspenseCache>(new SuspenseCache(refresh))
    return <Ctx.Provider value={ref.current}>
        {children}
    </Ctx.Provider>
}

export function useSuspensePromise<T>(key: string, generator: ()=>Promise<T>, deps: DependencyList = []): T {
    let ctx = useContext(Ctx)
    let result = ctx.get(key, generator)
    let {id} = result
    useEffect(()=>{
        ctx.watch(key, id)
        return ()=>ctx.unwatch(key, id)
    }, [...deps, id])
    if(result.loading) throw result.promise
    if(result.error) throw result.error.value
    return result.result
}

export function useClearSuspenseCache(key: string): ()=>void {
    let ctx = useContext(Ctx)
    return ()=>ctx.clear(key)
}
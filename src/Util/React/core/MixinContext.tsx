import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {ReactObj} from "Util/React/ReactMixin";
import ApplicationContext from "Util/React/core/ApplicationContext";
import {Button} from "Util/Components/SimpleComponents";

interface MixinCtxData {
    stopClosing: ()=> void
    enableClosing: ()=> void
}
const Ctx = createContext<MixinCtxData>({} as MixinCtxData)

export function MixinProvider({children, mixin}: PropsWithChildren<{mixin: ReactObj}>) {
    let stopClosing = ()=>mixin.stopClosing(true)
    let enableClosing = ()=>mixin.stopClosing(false)
    return <Ctx.Provider value={{stopClosing, enableClosing}}>
        {children}
    </Ctx.Provider>
}

export function useClosingPrevention(): MixinCtxData {
    let ctx = useContext(Ctx)
    let [stopped, setStopped] = useState(false)
    useEffect(()=>{
        if(!stopped) return
        ctx.stopClosing()
        return ()=>ctx.enableClosing()
    }, [stopped])
    return {
        stopClosing: ()=>setStopped(true),
        enableClosing: ()=>setStopped(false)
    }
}

export function ClosePreventionModal({forceClose}: {forceClose: ()=>Promise<void>}) {
    let myApp = useContext(ApplicationContext)
    let accept = async ()=>{
        await forceClose()
        await myApp.close()
    }
    let decline = async ()=> { await myApp.close() }
    return <div className="flex-col">
        <div>Are you sure you want to close?</div>
        <div className="flex-row">
            <Button onClick={accept}>Yes!</Button>
            <Button onClick={decline}>No!</Button>
        </div>
    </div>
}
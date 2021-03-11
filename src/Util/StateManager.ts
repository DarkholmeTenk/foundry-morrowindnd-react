import {createAction, createReducer} from "@reduxjs/toolkit";
import {registerGMSocket, registerPlayerSocket} from "../Socket/SocketHelper";

let reducers: any = {}
let sockets: any = {}

interface Act {
    method: string,
    args: any
}

interface Set<T> {
    value: any
}

export function StateUpdate(name: string) {
    return function(target: unknown, propertyKey: string, descriptor: any) {
        let originalMethod = descriptor.value
        let method = function() {
            let args = arguments
            let lastArg = args[args.length - 1]
            if(typeof lastArg === "object" && lastArg.__real) {
                originalMethod(...args)
            } else {
                sockets[name].sendUpdate({
                    method: propertyKey,
                    args
                })
            }
        }
        return {
            ...descriptor,
            value: method
        }
    }
}

export function SetupReducers<T>(name: string, defaultState: T) {
    let Constr = defaultState.constructor
    let act = createAction<Act>("act")
    let set = createAction<Set<T>>("set")
    let reduce = createReducer(defaultState,builder=>{
        builder
            .addCase(act, (prev,{payload})=>prev[payload.method](...payload.args, {__real: true}))
            .addCase(set, (prev, {payload})=>Constr(payload.value))
    })
    reducers[name] = { act, set, reduce}
    return reduce
}

export function SetupStateListener<T>(name: string, store: any) {
    let {act, set} = reducers[name]
    let actSocket = registerGMSocket<Act>(`SM_Act_${name}`, (data)=>store.dispatch(act(data)))
    let setSocket = registerPlayerSocket<Set<T>>(`SM_Set_${name}`, (data)=>store.dispatch(set(data)))
    store.subscribe(()=>{
        let data = store.getState().data
        setSocket({value: data})
    })
    sockets[name] = {actSocket, setSocket}
}
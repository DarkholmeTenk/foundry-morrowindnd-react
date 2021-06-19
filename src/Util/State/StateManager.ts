import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
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
            let args = [...arguments]
            let lastArg = args[args.length - 1]
            if(typeof lastArg === "object" && lastArg.__real) {
                return originalMethod.bind(this)(...args)
            } else {
                sockets[name].actSocket({
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
    let Constr = defaultState.constructor as any
    let set = createAction<Set<T>>("set")
    const actThunk = createAsyncThunk<T, Act>("act", async (payload, thunkAPI)=>{
        let prev = thunkAPI.getState()
        let newState = await prev[payload.method](...payload.args, {__real: true})
        return newState
    })
    let reduce = createReducer(defaultState,builder=>{
        builder
            .addCase(set, (prev, {payload})=>Constr.fromJSON(payload.value))
            .addCase(actThunk.fulfilled, (prev, x)=>{
                return x.payload
            })
    })
    reducers[name] = { actThunk, set, reduce}
    return reduce
}

export function SetupStateListener<T>(name: string, store: any) {
    let {actThunk, set} = reducers[name]
    let actSocket = registerGMSocket<Act>(`SM_Act_${name}`, (data)=>{
        console.log("Acting", data)
        store.dispatch(actThunk(data))
    })
    let setSocket = registerPlayerSocket<Set<T>>(`SM_Set_${name}`, (data)=>{
        console.log("Setting", data)
        store.dispatch(set({value: data}))
    })
    let refreshSocket = registerGMSocket<any>(`SM_Refresh_${name}`, ()=>{
        console.log("Refreshing")
        setSocket(store.getState())
    })
    store.subscribe(()=>{
        if(game.user.isGM) {
            let data = store.getState()
            console.log("Broadcasting", data)
            setSocket(data)
        }
    })
    sockets[name] = {actSocket, setSocket, refreshSocket}
    return {actSocket, setSocket, refreshSocket}
}
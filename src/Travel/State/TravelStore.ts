import {configureStore, createAction, createReducer} from "@reduxjs/toolkit";
import TravelState, {defaultTravelStateData, SetTask, SetActorTask, TravelStateData} from "./TravelState";
import {registerGMSocket, registerPlayerSocket} from "../../Socket/SocketHelper";

export const setActorTask = createAction<SetActorTask>("setActorTask")
export const setTask = createAction<SetTask>("setTask")
export const set = createAction<TravelStateData>("set")

function x<X>(action: (TravelState, {payload: X})=>TravelState): (data: TravelStateData, action: {payload: X})=>TravelStateData {
    return (data, {payload})=>action(new TravelState(data), {payload}).data
}

const reducer = createReducer<TravelStateData>(defaultTravelStateData, builder=>{
    builder
        .addCase(setActorTask, x((state, {payload})=>state.setActorTask(payload)))
        .addCase(setTask, x((state, {payload})=>state.setTask(payload)))
        .addCase(set, (state, {payload})=>payload)
})

export const TravelStore = configureStore({
    reducer,
    middleware: []
})

type SocketAction = {
    type: string,
    payload: SetActorTask | SetTask | TravelStateData
}

const socketDispatch = registerGMSocket<SocketAction>("TravelState", (action)=>{
    console.log("GM Travel Action", action)
    TravelStore.dispatch(action)
    setPlayerTravelState(TravelStore.getState())
})

export const dispatchTravelAction = socketDispatch
export const refreshTravelState = registerGMSocket("TravelStateGet", ()=>setPlayerTravelState(TravelStore.getState()))
const setPlayerTravelState = registerPlayerSocket<TravelStateData>("TravelStateSet", (x)=>{
    console.log("Setting player travel state", x)
    TravelStore.dispatch(set(x))
})
import {configureStore, createAction, createReducer} from "@reduxjs/toolkit";
import TravelState, {defaultTravelStateData, SetTask, SetActorTask, TravelStateData} from "./TravelState";
import {registerGMSocket, registerPlayerSocket} from "../../Socket/SocketHelper";
import {SetupReducers, SetupStateListener} from "../../Util/State/StateManager";

export const setActorTask = createAction<SetActorTask>("setActorTask")
export const setTask = createAction<SetTask>("setTask")
export const set = createAction<TravelStateData>("set")

function x<X>(action: (TravelState, {payload: X})=>TravelState): (data: TravelStateData, action: {payload: X})=>TravelStateData {
    return (data, {payload})=>action(new TravelState(data), {payload}).data
}

const reducer = SetupReducers("TravelState", new TravelState(defaultTravelStateData()))

export const TravelStore = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false
        })
    }
})

let {refreshSocket} = SetupStateListener("TravelState", TravelStore)

export const refreshTravelState = refreshSocket
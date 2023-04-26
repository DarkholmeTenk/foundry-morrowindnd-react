import {createContext, PropsWithChildren, useCallback, useContext, useState} from "react";
import {StateSetter} from "../update/Updater";
import {Checkbox, FormControlLabel} from "@mui/material";
import {SimpleCheckbox} from "Util/Components/SimpleComponents/SimpleCheckbox";

type GMInfo = boolean

const GmContextObj = createContext<GMInfo>(false)
type GmState = [GMInfo, StateSetter<GMInfo>]
const isReallyGm = () => game.user?.isGM ?? false

export function useGmState(): GmState {
    return useState<boolean>(isReallyGm)
}

export function GmContext({state, children}: PropsWithChildren<{state: GMInfo}>) {
    return <GmContextObj.Provider value={isReallyGm() && state}>
        {children}
    </GmContextObj.Provider>
}

export function GmContextControl({state, setState}: {state: GMInfo, setState: StateSetter<GMInfo>}) {
    if(!isReallyGm()) return null
    let toggleGm = useCallback(()=>setState(x=>!x), [setState])
    return <SimpleCheckbox label={state ? "GM" : "Player"} value={state} setValue={setState} />
}

export function useIsGm(): boolean {
    return useContext(GmContextObj)
}
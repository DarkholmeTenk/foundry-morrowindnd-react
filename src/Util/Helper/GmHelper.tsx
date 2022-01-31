import {createContext, useContext, useState} from "react";
import {SButton} from "../React/ReactHelpers";

interface GMInfo {
    isGm: boolean
}

export const GmContext = createContext<GMInfo>({isGm: false})

export function GmWindow({children}) {
    let isReallyGm = game.user?.isGM ?? false
    let [isGm, setIsmGm] = useState(isReallyGm);

    return <GmContext.Provider value={{isGm}}>
        <div>
            <div style={isReallyGm ? {} : {display: "hidden"}}>
                <SButton onClick={()=>setIsmGm(x=>!x)}>{isGm ? "GM" : "Player"}</SButton>
            </div>
            {children}
        </div>
    </GmContext.Provider>
}

export function useGmInfo() {
    return useContext(GmContext)
}
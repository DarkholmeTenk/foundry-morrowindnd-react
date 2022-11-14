import {useContext, useState} from "react";
import Selector from "../../Util/Components/Selector";
import {TownSizes} from "./TownScene";
import ApplicationContext from "../../Util/React/core/ApplicationContext";

export default function TownSettingsSheet({originalFlag, setOriginalFlag}) {
    let app = useContext(ApplicationContext)
    let [flag, setFlag] = useState(originalFlag)
    return <div>
        Town Size
        <Selector values={TownSizes} value={flag.size} setValue={(size)=>setFlag({...flag, size})} labelFunction={x=>x.name} includeNull />
        <button onClick={async ()=>{
            await setOriginalFlag(flag)
            await app.close()
        }}>Save</button>
    </div>
}
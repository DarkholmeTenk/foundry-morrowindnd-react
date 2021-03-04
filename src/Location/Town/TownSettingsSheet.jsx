import {useContext, useState} from "react";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";
import Selector from "../../Util/Selector";
import {TownSizes} from "./TownScene";

export default function TownSettingsSheet({originalFlag, setOriginalFlag}) {
    let app = useContext(AppContext)
    let [flag, setFlag] = useState(originalFlag)
    return <div>
        Town Size
        <Selector values={TownSizes} value={flag.size} setValue={(size)=>setFlag({...flag, size})} labelFunction={x=>x.name} includeNull />
        <button onClick={async ()=>{
            await setOriginalFlag(flag)
            app.close()
        }}>Save</button>
    </div>
}
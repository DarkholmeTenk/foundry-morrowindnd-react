import {useEffect, useState} from "react";
import {generateName} from "./NameHelper";
import NPCTypedMaker from "./NPCTypedMaker";
import NPCMakerInitialDirSelector from "./NPCMakerInitialDirSelector";

function TypeSelector({types, selectType}) {
    return (<div>
        {types.map(type=>(
            <button key={type} onClick={()=>selectType(type)}>
                {type}
            </button>
        ))}
    </div>);
}



export default function NPCMakerComponent() {
    let [dir, setDir] = useState(null)

    if(dir != null) {
        return <div>
            {dir.name} - <button onClick={()=>setDir(null)}>X</button>
            <NPCTypedMaker dir={dir} setDir={setDir} />
        </div>
    } else {
        return <div>
            <NPCMakerInitialDirSelector setDir={setDir}/>
        </div>
    }
}
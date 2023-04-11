import {useState} from "react";
import NPCTypedMaker from "./NPCTypedMaker";
import NPCMakerInitialDirSelector from "./NPCMakerInitialDirSelector";
import {Button} from "Util/Components/SimpleComponents";

function TypeSelector({types, selectType}) {
    return (<div>
        {types.map(type=>(
            <Button key={type} onClick={()=>selectType(type)}>
                {type}
            </Button>
        ))}
    </div>);
}



export default function NPCMakerComponent({}) {
    let [dir, setDir] = useState(null)

    if(dir != null) {
        return <div>
            {dir.name} - <Button onClick={()=>setDir(null)}>X</Button>
            <NPCTypedMaker dir={dir} setDir={setDir} />
        </div>
    } else {
        return <div>
            <NPCMakerInitialDirSelector setDir={setDir}/>
        </div>
    }
}
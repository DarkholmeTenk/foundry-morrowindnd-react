import {useState} from "react";
import NPCTypedMaker from "./NPCTypedMaker";
import NPCMakerInitialDirSelector from "Systems/NPCMaker/NPCMakerInitialDirSelector";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

function TypeSelector({types, selectType}) {
    return (<div>
        {types.map(type=>(
            <Button key={type} onClick={()=>selectType(type)}>
                {type}
            </Button>
        ))}
    </div>);
}

interface Dir {
    name: string
}
export default function NPCMakerComponent({}) {
    let [dir, setDir] = useState<Dir | null>(null)

    if(dir != null) {
        return <div>
            <span>{dir.name} - <Button onClick={()=>setDir(null)}>X</Button></span>
            <NPCTypedMaker dir={dir} setDir={setDir} />
        </div>
    } else {
        return <div>
            <NPCMakerInitialDirSelector setDir={setDir}/>
        </div>
    }
}
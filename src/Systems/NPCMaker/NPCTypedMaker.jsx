import {useEffect, useState} from "react";
import {NPCChoices, NPCImage} from "./NPCMakerUtils";
import NPCTagChooser from "./NPCTagChooser";
import NPCViewer from "./NPCViewer";
import {Button} from "Util/Components/SimpleComponents";
import {CircularProgress} from "@mui/material";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";


export default function NPCTypedMaker({dir, setDir}) {
    let {files: baseFiles, dirs} = useSuspensePromise("files." + dir.name, async ()=>dir.browse())
    let files = baseFiles.map(x=>new NPCImage(x))
    let [choice, setChoice] = useState(new NPCChoices())

    if(files === null) {
        return <CircularProgress />
    } else {
        let filtered = choice.filter(files)
        return <div>
            {dirs.map(d=><Button key={d.name} onClick={()=>setDir(d)}>{d.name}</Button>)}
            <NPCTagChooser files={files} filtered={filtered} choice={choice} setChoice={setChoice} />
            <NPCViewer filtered={filtered} choice={choice} />
        </div>
    }
}
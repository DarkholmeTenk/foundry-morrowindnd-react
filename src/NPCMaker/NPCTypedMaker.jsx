import {useEffect, useState} from "react";
import {NPCChoices, NPCImage} from "./NPCMakerUtils";
import NPCTagChooser from "./NPCTagChooser";
import NPCViewer from "./NPCViewer";


export default function NPCTypedMaker({dir, setDir}) {
    let [files, setFiles] = useState(null)
    let [dirs, setDirs] = useState([])
    let [choice, setChoice] = useState(new NPCChoices())
    useEffect(async ()=>{
        let {files: newFiles, dirs: newDirs} = await dir.browse()
        setFiles(newFiles.map(f=>new NPCImage(f)))
        setDirs(newDirs)
    }, [dir])

    if(files === null) {
        return "Loading"
    } else {
        let filtered = choice.filter(files)
        return <div>
            {dirs.map(d=><button key={d.name} onClick={()=>setDir(d)}>{d.name}</button>)}
            <NPCTagChooser files={files} filtered={filtered} choice={choice} setChoice={setChoice} />
            <NPCViewer filtered={filtered} choice={choice} />
        </div>
    }
}
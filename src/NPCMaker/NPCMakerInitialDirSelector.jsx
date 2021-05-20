import {useEffect, useState} from "react";
import {listFiles} from "@darkholme/foundry-react-core/src/Util/FilesHelper";

export default function NPCMakerInitialDirSelector({setDir}) {
    let [dirs, setDirs] = useState(null)

    useEffect(()=>{
        let run = async ()=>{
            let {dirMap} = await listFiles({storage: "s3", target: "mobs", bucket: "foundry-darkcraft-bucket"})
            setDirs(dirMap)
        }
        run()
    }, [setDir])
    if(dirs == null) {
        return "Loading..."
    } else {
        return <div>x
            {Object.keys(dirs).map(dir=><button key={dir} onClick={()=>setDir(dirs[dir])}>{dir}</button> )}
        </div>
    }
}
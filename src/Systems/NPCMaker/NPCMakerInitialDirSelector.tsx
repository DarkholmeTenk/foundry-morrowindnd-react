import {useEffect, useState} from "react";
import {listFiles} from "Util/Helper/FilesHelper";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {CircularProgress} from "@mui/material";

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
        return <CircularProgress />
    } else {
        let q = dirs!
        return <div>xd
            {Object.keys(dirs).map(dir=><Button key={dir} onClick={()=>setDir(q[dir])}>{dir}</Button> )}
        </div>
    }
}
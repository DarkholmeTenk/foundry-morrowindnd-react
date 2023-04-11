import {useEffect, useState} from "react";
import {listFiles} from "Util/Helper/FilesHelper";
import {Button} from "Util/Components/SimpleComponents";

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
        return <div>xd
            {Object.keys(dirs).map(dir=><Button key={dir} onClick={()=>setDir(dirs[dir])}>{dir}</Button> )}
        </div>
    }
}
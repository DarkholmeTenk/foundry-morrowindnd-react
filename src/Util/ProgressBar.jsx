import {useContext, useEffect, useState} from "react";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";

export default function ProgressBar({items, forEach, labeler=(x)=>toString(x)}) {
    let [done, setDone] = useState(0)
    let app = useContext(AppContext)
    useEffect(()=>{
        items.forEach(async (item)=>{
            await forEach(item)
        })
    }, [])
    return <div>

    </div>
}
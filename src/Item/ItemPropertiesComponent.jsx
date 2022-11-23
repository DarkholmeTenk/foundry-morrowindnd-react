import {useCallback, useContext, useState} from "react";
import SoulGemPropertiesComponent from "./Enchanting/SoulGems/SoulGemPropertiesComponent";
import ApplicationContext from "../Util/React/core/ApplicationContext";
import {Button} from "@material-ui/core";

export default function ItemPropertiesComponent({flag, setFlag}) {
    let app = useContext(ApplicationContext)
    let [state, setState] = useState(flag || {})
    let setSoulGem = useCallback((v)=>setState({...state, soulGem: v}), [state, setState])
    let setAlchemy = useCallback((v)=>setState({...state, alchemy: v}), [state, setState])
    return <div>
        <div>
            Soul Gem:
            <SoulGemPropertiesComponent soulGemState={state?.soulGem} setSoulGemState={setSoulGem} />
        </div>
        <Button onClick={async ()=>{
            await setFlag(state)
            await app.close()
        }}>Save</Button>
    </div>
}
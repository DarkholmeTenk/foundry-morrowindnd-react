import {useContext, useState} from "react";
import SoulGemPropertiesComponent from "../Enchanting/SoulGems/SoulGemPropertiesComponent";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";

export default function ItemPropertiesComponent({flag, setFlag}) {
    let app = useContext(AppContext)
    let [state, setState] = useState(flag || {})
    return <div>
        <div>
            Soul Gem:
            <SoulGemPropertiesComponent soulGemState={state?.soulGem} setSoulGemState={(v)=>{setState({...state, soulGem: v})}} />
        </div>
        <button onClick={async ()=>{
            await setFlag(state)
            app.close()
        }}>Save</button>
    </div>
}
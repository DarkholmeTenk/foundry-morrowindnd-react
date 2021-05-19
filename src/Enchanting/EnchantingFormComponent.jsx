import {useContext, useState} from "react";
import {onDrop} from "@darkholme/foundry-react-core/src/Util/DropHelper";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";

import EnchantConfig from "./EnchantConfig";
import ItemViewer from "../Util/ItemViewer.tsx";
import Selector from "../Util/Selector";
import {getEnchantData} from "./Enchanter";


/**
 * @param item {Item}
 * @constructor
 */
export default function EnchantingFormComponent({item}) {
    let ItemClass = item.constructor
    let sizes = EnchantConfig.instance.CastableSizes
    let App = useContext(AppContext)
    let [spell, setSpell] = useState(null)
    let [charges, setCharges] = useState(sizes[0])
    let result = (spell && item) ? new ItemClass(getEnchantData({itemData: item.data, spellData: spell.data, charges})) : null
    let onDropped = onDrop((i)=>{
        if(i instanceof Item && i.type === "spell") {
            setSpell(i)
        }
    })
    return <div>
        Item to Enchant:
        <ItemViewer item={item} />
        Spell to Enchant:
        <ItemViewer item={spell} onDrop={onDropped} />
        Charges:
        <Selector values={sizes} value={charges} setValue={setCharges} labelFunction={(x)=>`${x.label} - ${x.charges}`} />
        Result:
        <ItemViewer item={result} />
        <button disabled={result == null} onClick={async ()=>{
            await Item.create(result.data, {renderSheet: true})
            App.close()
        }}>Create</button>
    </div>

}
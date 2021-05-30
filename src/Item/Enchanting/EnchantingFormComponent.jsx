import {useContext, useState} from "react";
import EnchantConfig from "./EnchantConfig";
import ItemViewer from "../../Util/Components/ItemViewer.tsx";
import Selector from "../../Util/Components/Selector";
import {getEnchantData} from "./Enchanter";
import {onDrop} from "../../Util/Helper/DropHelper";
import AppContext from "../../Util/React/AppContext";


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
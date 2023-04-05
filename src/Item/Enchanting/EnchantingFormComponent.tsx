import {useContext, useState} from "react";
import EnchantConfig from "./EnchantConfig";
import ItemViewer from "../../Util/Components/ItemViewer/ItemViewer";
import Selector from "../../Util/Components/Selector/Selector";
import {getEnchantData} from "./Enchanter";
import {onDrop} from "Util/Helper/DropHelper";
import ApplicationContext from "../../Util/React/core/ApplicationContext";
import Styles from "./EnchantingFormComponent.module.scss"

interface Props {
    item: Item5e
}
export default function EnchantingFormComponent({item}: Props) {
    let sizes = EnchantConfig.instance.CastableSizes
    let App = useContext(ApplicationContext)
    let [spell, setSpell] = useState<ItemSpell | null>(null)
    let [charges, setCharges] = useState(sizes[0])
    let result = (spell && item) ? getEnchantData({itemData: item._source as SmartItemData & HoldableEntry, spellData: spell._source as SmartItemData & SpellEntry, charges}) : null
    let onDropped = onDrop((i)=>{
        if(i instanceof Item && i.type === "spell") {
            setSpell(i as ItemSpell)
        }
    })
    return <div className={Styles.EnchantingForm}>
        <div className={Styles.Row}>
            <span>Enchanting:</span>
            <ItemViewer item={item} />
        </div>
        <div className={Styles.Row}>
            <span>With Spell:</span>
            <ItemViewer item={spell || undefined} onDrop={onDropped} />
        </div>
        <div className={Styles.Row}>
            <span>Charges:</span>
            <Selector values={sizes} value={charges} setValue={(x)=>setCharges(x)} labelFunction={(x)=>`${x.label} - ${x.charges}`} />
        </div>
        <div className={Styles.Row}>
            <span>Result:</span>
            <ItemViewer item={result} />
        </div>
        <button disabled={result == null} onClick={async ()=>{
            if(!result) return
            await Item.create(result, {renderSheet: true})
            App.close()
        }}>Create</button>
    </div>

}
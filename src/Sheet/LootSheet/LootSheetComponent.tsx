import {useNPC} from "../../Util/Helper/EntityHelper";
import ItemTable, {
    NumberFormat
} from "../../Util/Components/ItemTable/ItemTable";
import {LootSplitNGS, LootTakeSocket} from "./LootAction";
import {openItemQuantitySelect} from "./ItemQuantitySelector";
import {getActorId} from "../../Util/Identifiers/ActorID";
import TokenPermission from "../../Util/Components/TokenPermission";
import GoldSection from "./GoldSection";
import Style from "./LootSheet.module.scss"
import GoldDisplay from "../../Util/Components/GoldDisplay";
import {ItemColumnDefaults} from "../../Util/Components/ItemTable/ItemTableDefaults";
import {generateControlsColumn, getEditControl} from "../../Util/Components/ItemTable/ItemTableControl";
import useSelf from "../../Util/Components/SelfActorSelector";
import getFlag from "../../Util/Helper/FlagHelper";
import {buildDesireMap, DEFAULT_LOOT_FLAG, LOOT_FLAG_ID, LootFlag} from "./LootFlags";
import LootSheetDesireComponent from "./LootSheetDesireComponent";
import {Button} from "@material-ui/core";
import {useCallback} from "react";

export default function LootSheetComponent({npc: npcInput, self: selfInput}) {
    let {value: npc} = useNPC(npcInput)
    let {actor: self, actorId: selfId, component: selfChooser} = useSelf()
    let [flag, setFlag] = getFlag<LootFlag>(npc, LOOT_FLAG_ID, DEFAULT_LOOT_FLAG)
    let mappedDesires = buildDesireMap(flag.desires)

    let takeControls = ({item})=>{
        let controls = [getEditControl(item)]
        if(item.owner) {
            controls.push({title: "Delete", text: <i className="fas fa-trash" />, classes: "item-delete", onClick: ()=>item.delete()})
        }
        if(self) {
            controls.push({title: "Take", text: <i className="fas fa-hand-holding" />, onClick: ()=>{
                    let take = (qty)=>LootTakeSocket({selfId: getActorId(self), lootId: {actorId: getActorId(npc), itemId: item.id}, qty})
                    openItemQuantitySelect({item, max: item?.data?.data?.quantity || 1, buttonText: "Take", onConfirm: take})
                }})
        }
        return controls
    }

    let items = npc.items.filter(i=>i.type !== "spell")
    let columns = [
        ...ItemColumnDefaults,
        {
            title: "Value (i)",
            getter: ({item})=><GoldDisplay value={item.data.data.price}/>
        }, {
            title: "Value (t)",
            getter: ({item})=><GoldDisplay value={item.data.data.price * (item.data.data.quantity || 1)}/>
        }, {
            title: "V/W",
            getter: ({item})=>item.data.data.weight > 0 ? NumberFormat.format(item.data.data.price / item.data.data.weight) : "-"
        },
        generateControlsColumn(takeControls), {
            title: "Desire",
            getter: ({item})=><LootSheetDesireComponent item={item} selfId={selfId} desires={mappedDesires} />
        }
    ]

    let splitNGS = useCallback(()=>LootSplitNGS({lootId: getActorId(npc)}), [npc])
    return <div>
        <div className={Style.header}>
            <GoldSection npc={npc}
                         disabled={!npc.owner}
            />
            {npc.owner ? <TokenPermission token={npc} /> : null }
        </div>
        {selfChooser}
        <Button onClick={splitNGS}>Split NGS</Button>
        {items.length > 0 ? <ItemTable items={items} columns={columns} extraProps={{mappedDesires}}/> : null}
    </div>
}
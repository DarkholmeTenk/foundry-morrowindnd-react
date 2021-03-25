import {useNPC} from "../../Util/EntityHelper";
import {NumberFormat, ItemTable} from "../../Util/Components/ItemTable";
import {LootTakeSocket} from "./LootAction";
import {openItemQuantitySelect} from "./ItemQuantitySelector";
import {getActorId} from "../../Util/Identifiers/ActorID";
import TokenPermission from "../../Util/Components/TokenPermission";
import GoldSection from "./GoldSection";
import Style from "./LootSheet.module.scss"
import {Card, CardContent, CardHeader} from "@material-ui/core";
import GoldDisplay from "../../Util/Components/GoldDisplay";



export default function LootSheetComponent({npc: npcInput, self: selfInput}) {
    let {value: npc} = useNPC(npcInput)
    let {value: self} = useNPC(selfInput)

    let takeControls = (item)=>{
        let controls = []
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
    let extraColumns = [
        {
            title: "Value (i)",
            getter: (i)=><GoldDisplay value={i.data.data.price}/>
        }, {
            title: "Value (t)",
            getter: (i)=><GoldDisplay value={i.data.data.price * (i.data.data.quantity || 1)}/>
        }, {
            title: "V/W",
            getter: (i)=>i.data.data.weight > 0 ? NumberFormat.format(i.data.data.price / i.data.data.weight) : "-"
        }
    ]

    return <div>
        <div className={Style.header}>
            <GoldSection npc={npc}
                         disabled={!npc.owner}
            />
            {npc.owner ? <TokenPermission token={npc} /> : null }
        </div>
        {items.length > 0 ? <ItemTable items={items} extraColumns={extraColumns} controls={takeControls}/> : null}
    </div>
}
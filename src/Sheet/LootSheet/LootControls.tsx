import {useCallback} from "react";
import {ItemControl} from "../../Util/Components/NewItemTable/Item/ItemControls";
import {LootTakeSocket} from "./LootAction";
import {getActorId} from "../../Util/Identifiers/ActorID";
import {getItemId} from "../../Util/Identifiers/ItemID";
import {openItemQuantitySelect} from "./ItemQuantitySelector";


interface LootControlsProps {
    item: Item,
    self: Actor | null,
    npc: Actor | null
}
export function LootControls({item, self, npc}:  LootControlsProps) {
    let deleteMe = useCallback(()=>item.delete(), [item])
    let takeMe = useCallback(()=>{
        if(!self || !npc) return
        let take = (qty)=>LootTakeSocket({selfId: getActorId(self), lootId: {actorId: getActorId(npc), ...getItemId(item)}, qty})
        openItemQuantitySelect({item, max: item.qty() ?? 1, buttonText: "Take", onConfirm: take})
    }, [item, self, npc])
    return <>
        <ItemControl title={"Edit Item"} icon={"fas fa-edit"} onClick={()=>item.sheet!.render(true, {editable: item.isOwner} as any)} />
        {item.isOwner ? <ItemControl title={"Delete"} icon={"fas fa-trash"} onClick={deleteMe} /> : null}
        {self && npc ? <ItemControl title={"Take"} icon={"fas fa-hand-holding"} onClick={takeMe} /> : null}
    </>
}
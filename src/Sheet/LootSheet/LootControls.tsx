import {useCallback} from "react";
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import {LootTakeSocket} from "./LootAction";
import {openItemQuantitySelect} from "./ItemQuantitySelector";
import {itemQty} from "Util/Extension/Items";
import {DeleteIcon, EditIcon, TakeIcon} from "Util/Components/SimpleComponents/IconLibrary";

interface LootControlsProps {
    item: Item,
    self: Actor | null,
    npc: Actor | null
}
export function LootControls({item, self, npc}:  LootControlsProps) {
    let deleteMe = useCallback(()=>item.delete(), [item])
    let takeMe = useCallback(()=>{
        if(!self || !npc) return
        let take = (qty)=>LootTakeSocket({selfId: self.uuid, lootId: item.uuid, qty})
        openItemQuantitySelect({item, max: itemQty(item) || 1, buttonText: "Take", onConfirm: take})
    }, [item, self, npc])
    return <>
        <ItemControl title={"Edit Item"} icon={EditIcon} onClick={()=>item.sheet!.render(true, {editable: item.isOwner} as any)} />
        {item.isOwner ? <ItemControl title={"Delete"} icon={DeleteIcon} onClick={deleteMe} /> : null}
        {self && npc ? <ItemControl title={"Take"} icon={TakeIcon} onClick={takeMe} /> : null}
    </>
}
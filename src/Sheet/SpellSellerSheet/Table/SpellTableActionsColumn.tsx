import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import React from "react";

interface SpellActionsColumnArgs {
    item: ItemSpell,
    self: Actor5e,
    merchant: Actor5e,
    setBuying: (spell: ItemSpell)=>void
}

export function SpellActionsColumn({item, self, merchant, setBuying}: SpellActionsColumnArgs) {
    return <>
        <ItemControl title="Open" icon="fas fa-eye" onClick={() => item.sheet?.render(true)}/>
        <ItemControl title="Buy Spell" icon="fas fa-dollar-sign" onClick={()=>setBuying(item)}/>
    </>
}
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import React from "react";
import {BuyIcon, ViewIcon} from "Util/Components/SimpleComponents/IconLibrary";

interface SpellActionsColumnArgs {
    item: ItemSpell,
    self: Actor5e,
    merchant: Actor5e,
    setBuying: (spell: ItemSpell)=>void
}

export function SpellActionsColumn({item, self, merchant, setBuying}: SpellActionsColumnArgs) {
    return <>
        <ItemControl title="Open" icon={ViewIcon} onClick={() => item.sheet?.render(true)}/>
        <ItemControl title="Buy Spell" icon={BuyIcon} onClick={()=>setBuying(item)}/>
    </>
}
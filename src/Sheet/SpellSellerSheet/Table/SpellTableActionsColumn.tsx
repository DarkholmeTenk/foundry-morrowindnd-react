import {Discount, SpellSellerBuy} from "Sheet/SpellSellerSheet/SpellSellerAction";
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import React from "react";

interface SpellActionsColumnArgs {
    item: ItemSpell,
    self: Actor5e,
    merchant: Actor5e
}

export function SpellActionsColumn({item, self, merchant}: SpellActionsColumnArgs) {
    let buy = () => SpellSellerBuy({
        merchant: merchant.uuid,
        self: self.uuid,
        spell: item.uuid,
        discount: Discount.NONE
    })
    return <>
        <ItemControl title="Open" icon="fas fa-eye" onClick={() => item.sheet?.render(true)}/>
        <ItemControl title="Buy Spell" icon="fas fa-dollar-sign" onClick={buy}/>
    </>
}
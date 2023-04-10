import {registerGMSocket} from "Util/Socket/SocketHelper";
import {getGoldAmountFromActor, removeGold} from "Util/Helper/GoldHelper";
import {addItem} from "Util/Helper/ItemTransferHelper";
import {calculateSpellCost, SpellPurchasePriceModifier} from "./SpellCostCalculator";
import {loadActor, loadUUID} from "Util/Identifiers/UuidHelper";
import {isSpell} from "Constants/SpellConstants";
import {Messages} from "Util/Messages";

interface BuyAction {
    self: UUID,
    merchant: UUID,
    spell: UUID,
    modifier: SpellPurchasePriceModifier
}

export const SpellSellerBuy = registerGMSocket<BuyAction>("SpellSellerSheet_Buy", async ({self: selfId, merchant: merchantId, spell: spellId, modifier})=>{
    let merchant = (await loadActor(merchantId))!
    let self = (await loadActor(selfId))!
    let spell = (await loadUUID(spellId, isSpell))!
    let price = calculateSpellCost(spell, modifier)
    let myGold = getGoldAmountFromActor(self)
    let messages = new Messages()
    if(price && myGold >= price) {
         await addItem(self.uuid, spell._source, {qty: 1})
         await removeGold(self, price)
        messages.addMessage(self, "has bought the spell", spell, "for", {type: "gp", value: price})
        await messages.send()
    }
})
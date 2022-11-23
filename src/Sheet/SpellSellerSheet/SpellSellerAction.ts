import {registerGMSocket} from "../../Util/Socket/SocketHelper";
import {getGoldAmountFromActor, removeGold} from "../../Util/Helper/GoldHelper";
import {addItem} from "../../Util/Helper/ItemTransferHelper";
import {getSpellClasses} from "../../Data/SpellData";
import {calculateSpellCost} from "./SpellCostCalculator";
import {loadActor, loadUUID} from "../../Util/Identifiers/UuidHelper";
import {isSpell} from "../../Constants/SpellConstants";

interface BuyAction {
    self: UUID,
    merchant: UUID,
    spell: UUID
}

export const SpellSellerBuy = registerGMSocket<BuyAction>("SpellSellerSheet_Buy", async ({self: selfId, merchant: merchantId, spell: spellId})=>{
    let merchant = (await loadActor(merchantId))!
    let self = (await loadActor(selfId))!
    let spell = (await loadUUID(spellId, isSpell))!
    let spellData = (await getSpellClasses(spell))!
    let price = calculateSpellCost(self, spell, spellData)
    let myGold = getGoldAmountFromActor(self)
    if(price && myGold >= price) {
         await addItem(self.uuid, spell._source, {qty: 1})
         await removeGold(self, price)
    }
})
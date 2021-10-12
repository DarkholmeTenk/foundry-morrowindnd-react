import {registerGMSocket} from "../../Util/Socket/SocketHelper";
import {ActorId, getActor} from "../../Util/Identifiers/ActorID";
import {getItem, ItemId} from "../../Util/Identifiers/ItemID";
import {getGoldAmountFromActor, removeGold} from "../../Util/Helper/GoldHelper";
import {addItem} from "../../Util/Helper/ItemTransferHelper";
import {getSpellClasses} from "../../Data/SpellData";
import {calculateSpellCost} from "./SpellCostCalculator";

interface BuyAction {
    self: ActorId,
    merchant: ActorId,
    spell: ItemId
}

export const SpellSellerBuy = registerGMSocket<BuyAction>("SpellSellerSheet_Buy", async ({self: selfId, merchant: merchantId, spell: spellId})=>{
    let merchant = (await getActor(merchantId))!
    let self = (await getActor(selfId))!
    let spell = (await getItem(spellId))!
    let spellData = (await getSpellClasses(spell))!
    let price = calculateSpellCost(self, spell, spellData)
    let myGold = getGoldAmountFromActor(self.data)
    if(price && myGold >= price) {
         await addItem(spell.data, selfId, 1)
         await removeGold(self, price)
    }
})
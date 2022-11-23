import {registerGMSocket} from "../../Util/Socket/SocketHelper";
import {getBuyPrice, getMerchantFlag, getSellPrice} from "./MerchantFlag";
import {addGold, getGoldAmountFromActor, removeGold} from "../../Util/Helper/GoldHelper";
import {addItem, removeItem} from "../../Util/Helper/ItemTransferHelper";
import {TokenSettings} from "../../Token/TokenSettings";
import {getSellDesireItems} from "../LootSheet/Desire/SellDesireButton";
import {itemQty} from "../../Util/Items";
import {loadActor, loadItem} from "../../Util/Identifiers/UuidHelper";

interface BuyAction {
    self: UUID,
    merchant: UUID,
    item: UUID,
    qty: number
}

export const MerchantBuy = registerGMSocket<BuyAction>("MerchantSheet_Buy", async ({self: selfId, merchant: merchantId, item: itemId, qty})=>{
    let merchant = (await loadActor(merchantId))!
    let self = (await loadActor(selfId))!
    let item = (await loadItem(itemId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    let price = getBuyPrice(item, qty, merchantFlag)
    let myGold = getGoldAmountFromActor(self)
    if(myGold >= price) {
        if(item.actor) await removeItem(itemId, qty)
        await addItem(selfId, item._source, {qty})
        await removeGold(self, price)
    }
})

interface SellItem {
    itemId: UUID,
    qty: number
}
interface SellAction {
    merchant: UUID,
    items: SellItem[]
}
export const MerchantSell = registerGMSocket<SellAction>("MerchantSheet_Sell", async ({merchant: merchantId, items})=>{
    let merchant = (await loadActor(merchantId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    await Promise.all(items.map(async ({itemId, qty})=>{
        let item = (await loadItem(itemId))!
        let self = item?.actor!
        let price = getSellPrice(item, qty, merchantFlag)
        await removeItem(itemId, qty)
        //await addItem(item.data, merchantId, qty)
        await addGold(self, price)
    }))
})

interface SellJunkAction {
    merchant: UUID,
    users: string[]
}
export const MerchantSellJunk = registerGMSocket<SellJunkAction>("MerchantSheet_SellJunk", async({merchant: merchantId, users})=>{
    let merchant = (await loadActor(merchantId))!
    let holderId = TokenSettings.value.sellLootDump!
    let holder = (await loadActor(holderId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    let items = getSellDesireItems(holder)
    let totalPrice = 0
    let messages: string[] = []
    for(let item of items) {
        let qty = itemQty(item)
        let price = getSellPrice(item, qty, merchantFlag)
        totalPrice += price
        messages.push(`Selling ${item.name} x ${qty} for ${price}`)
        await removeItem(item.uuid, qty)
    }
    await holder.update({sort: (holder.sort ?? 0) + 1})
    let split = totalPrice/users.length
    for(let user of users) {
        let actor = game.users!.get(user)!.character!
        messages.push(`Giving ${actor.name} gold x ${split} from the proceeds`)
        await addGold(actor, split)
    }
    await ChatMessage.create({content: messages.join("<br/>")})
})
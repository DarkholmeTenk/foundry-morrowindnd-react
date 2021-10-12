import {registerGMSocket} from "../../Util/Socket/SocketHelper";
import {ActorId, getActor} from "../../Util/Identifiers/ActorID";
import {getItem, getItemId, isOwnedItem, ItemId, OwnedItemId} from "../../Util/Identifiers/ItemID";
import {getBuyPrice, getMerchantFlag, getSellPrice} from "./MerchantFlag";
import {addGold, getGoldAmountFromActor, removeGold} from "../../Util/Helper/GoldHelper";
import {addItem, removeItem} from "../../Util/Helper/ItemTransferHelper";
import {TokenSettings} from "../../Token/TokenSettings";
import {getSellDesireItems} from "../LootSheet/Desire/SellDesireButton";

interface BuyAction {
    self: ActorId,
    merchant: ActorId,
    item: ItemId,
    qty: number
}

export const MerchantBuy = registerGMSocket<BuyAction>("MerchantSheet_Buy", async ({self: selfId, merchant: merchantId, item: itemId, qty})=>{
    let merchant = (await getActor(merchantId))!
    let self = (await getActor(selfId))!
    let item = (await getItem(itemId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    let price = getBuyPrice(item, qty, merchantFlag)
    let myGold = getGoldAmountFromActor(self.data)
    if(myGold >= price) {
        if(isOwnedItem(itemId)) await removeItem(itemId, qty)
        await addItem(item.data, selfId, qty)
        await removeGold(self, price)
    }
})

interface SellItem {
    itemId: OwnedItemId,
    qty: number
}
interface SellAction {
    merchant: ActorId,
    items: SellItem[]
}
export const MerchantSell = registerGMSocket<SellAction>("MerchantSheet_Sell", async ({merchant: merchantId, items})=>{
    let merchant = await getActor(merchantId)
    let [merchantFlag] = getMerchantFlag(merchant)
    await Promise.all(items.map(async ({itemId, qty})=>{
        let self = await getActor(itemId.actorId)
        let item = (await getItem(itemId))!
        let price = getSellPrice(item, qty, merchantFlag)
        await removeItem(itemId, qty)
        //await addItem(item.data, merchantId, qty)
        await addGold(self, price)
    }))
})

interface SellJunkAction {
    merchant: ActorId,
    users: string[]
}
export const MerchantSellJunk = registerGMSocket<SellJunkAction>("MerchantSheet_SellJunk", async({merchant: merchantId, users})=>{
    let merchant = await getActor(merchantId)
    let holderId = TokenSettings.value.sellLootDump!
    let holder = (await getActor(holderId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    let items = getSellDesireItems(holder)
    let totalPrice = 0
    let messages: string[] = []
    for(let item of items) {
        let qty = item.qty()
        let price = getSellPrice(item, qty, merchantFlag)
        totalPrice += price
        messages.push(`Selling ${item.name} x ${qty} for ${price}`)
        await removeItem({...getItemId(item), actorId: holderId}, qty)
    }
    await holder.update({sort: (holder.data as any).sort + 1})
    let split = totalPrice/users.length
    for(let user of users) {
        let actor = game.users!.get(user)!.character!
        messages.push(`Giving ${actor.name} gold x ${split} from the proceeds`)
        await addGold(actor, split)
    }
    await ChatMessage.create({content: messages.join("<br/>")})
})
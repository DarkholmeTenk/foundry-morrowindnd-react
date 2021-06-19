import {registerGMSocket} from "../../Util/Socket/SocketHelper";
import {ActorId, getActor} from "../../Util/Identifiers/ActorID";
import {getItem, isOwnedItem, ItemId, OwnedItemId} from "../../Util/Identifiers/ItemID";
import {getBuyPrice, getMerchantFlag, getSellPrice} from "./MerchantFlag";
import {addGold, getGoldAmountFromActor, removeGold} from "../../Util/Helper/GoldHelper";
import {addItem, removeItem} from "../../Util/Helper/ItemTransferHelper";

interface BuyAction {
    self: ActorId,
    merchant: ActorId,
    item: ItemId,
    qty: number
}

export const MerchantBuy = registerGMSocket<BuyAction>("MerchantSheet_Buy", async ({self: selfId, merchant: merchantId, item: itemId, qty})=>{
    let merchant = await getActor(merchantId)
    let self = await getActor(selfId)
    let item = await getItem(itemId)
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
    await Promise.all(items.map(async ({itemId, qty})=>{
        let self = await getActor(itemId.actorId)
        let item = await getItem(itemId)
        let [merchantFlag] = getMerchantFlag(merchant)
        let price = getSellPrice(item, qty, merchantFlag)
        await removeItem(itemId, qty)
        //await addItem(item.data, merchantId, qty)
        await addGold(self, price)
    }))
})
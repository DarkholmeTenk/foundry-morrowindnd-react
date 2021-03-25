import {registerGMSocket} from "../../Socket/SocketHelper";
import {ActorId, getActor, getActorId} from "../../Util/Identifiers/ActorID";
import {getItem, OwnedItemId} from "../../Util/Identifiers/ItemID";
import {getBuyPrice, getMerchantFlag, getSellPrice} from "./MerchantFlag";
import {addGold, getGoldAmountFromActor, removeGold} from "../../Util/Helper/GoldHelper";
import {addItem, removeItem} from "../../Util/Helper/ItemTransferHelper";

interface BuyAction {
    self: ActorId,
    item: OwnedItemId,
    qty: number
}

export const MerchantBuy = registerGMSocket<BuyAction>("MerchantSheet_Buy", async ({self: selfId, item: itemId, qty})=>{
    let merchant = await getActor(itemId.actorId)
    let self = await getActor(selfId)
    let item = await getItem(itemId)
    let [merchantFlag] = getMerchantFlag(merchant)
    let price = getBuyPrice(item, qty, merchantFlag)
    let myGold = getGoldAmountFromActor(self.data)
    if(myGold >= price) {
        await removeItem(itemId, qty)
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
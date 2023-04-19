import {registerGMSocket} from "Util/Socket/SocketHelper";
import {loadActor, loadItem} from "Util/Identifiers/UuidHelper";
import {getBuyPrice, getMerchantFlag} from "../Flag/MerchantFlag";
import {getGoldAmountFromActor, removeGold} from "Util/Helper/GoldHelper";
import {addItem, removeItem} from "Util/Helper/ItemTransferHelper";
import {Messages} from "Util/Messages";

export async function getBuyActionData({self: selfId, merchant: merchantId, item: itemId, qty }: BuyAction) {
    let merchant = (await loadActor(merchantId))!
    let self = (await loadActor(selfId))!
    let x: MerchantInventoryItem
    if(itemId.type === "item5e") {
        let realItem = await loadItem(itemId.item)
        if(!realItem) {
            console.error("Unable to buy item", itemId)
        }
        x = {type: "item5e", item: realItem!, qty: itemId.qty}
    } else {
        x = itemId
    }
    let [merchantFlag] = getMerchantFlag(merchant)
    let price = getBuyPrice(x, qty, merchantFlag)
    let myGold = getGoldAmountFromActor(self)
    return {merchant, self, mii: x, price, myGold, qty}
}

type BuyItem = ({"type": "item5e", "item": UUID} | {"type": "itemdata", "item": SmartItemData}) & {qty?: number}
export interface BuyAction {
    self: UUID,
    merchant: UUID,
    item: BuyItem,
    qty: number
}

export const MerchantBuy = registerGMSocket<BuyAction>("MerchantSheet_Buy", async (action) => {
    let {merchant, self, mii, price, myGold, qty} = await getBuyActionData(action)
    let messages = new Messages()
    if (myGold >= price) {
        if (mii.type == "item5e" && mii.item.parent === merchant) await removeItem(mii.item.uuid, qty)
        await addItem(self, mii.type == "item5e" ? mii.item._source : mii.item, {qty})
        await removeGold(self, price)
        messages.addMessage(self, "has purchased", mii.item, "*", qty.toString(), "for", {type: "gp", value: price})
        await messages.send()
    }
})
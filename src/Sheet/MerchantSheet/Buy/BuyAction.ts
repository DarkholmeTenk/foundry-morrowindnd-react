import {registerGMSocket} from "Util/Socket/SocketHelper";
import {loadActor, loadItem} from "Util/Identifiers/UuidHelper";
import {getBuyPrice, getMerchantFlag} from "../Flag/MerchantFlag";
import {getGoldAmountFromActor, removeGold} from "Util/Helper/GoldHelper";
import {addItem, removeItem} from "Util/Helper/ItemTransferHelper";

type BuyItem = ({"type": "item5e", "item": UUID} | {"type": "itemdata", "item": SmartItemData}) & {qty?: number}
interface BuyAction {
    self: UUID,
    merchant: UUID,
    item: BuyItem,
    qty: number
}

export const MerchantBuy = registerGMSocket<BuyAction>("MerchantSheet_Buy", async ({self: selfId, merchant: merchantId, item: itemId, qty }) => {
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
    if (myGold >= price) {
        if (x.type == "item5e" && x.item.parent === merchant) await removeItem(x.item.uuid, qty)
        await addItem(selfId, x.type == "item5e" ? x.item._source : x.item, {qty})
        await removeGold(self, price)
    }
})
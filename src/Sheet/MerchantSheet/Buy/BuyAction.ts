import {registerGMSocket} from "../../../Util/Socket/SocketHelper";
import {loadActor, loadItem} from "../../../Util/Identifiers/UuidHelper";
import {getBuyPrice, getMerchantFlag} from "../Flag/MerchantFlag";
import {getGoldAmountFromActor, removeGold} from "../../../Util/Helper/GoldHelper";
import {addItem, removeItem} from "../../../Util/Helper/ItemTransferHelper";

interface BuyAction {
    self: UUID,
    merchant: UUID,
    item: UUID,
    qty: number
}

export const MerchantBuy = registerGMSocket<BuyAction>("MerchantSheet_Buy", async ({self: selfId, merchant: merchantId, item: itemId, qty }) => {
    let merchant = (await loadActor(merchantId))!
    let self = (await loadActor(selfId))!
    let item = (await loadItem(itemId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    let price = getBuyPrice(item, qty, merchantFlag)
    let myGold = getGoldAmountFromActor(self)
    if (myGold >= price) {
        if (item.actor) await removeItem(itemId, qty)
        await addItem(selfId, item._source, {qty})
        await removeGold(self, price)
    }
})
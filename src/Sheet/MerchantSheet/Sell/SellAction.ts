import {registerGMSocket} from "../../../Util/Socket/SocketHelper";
import {loadActor, loadItem} from "../../../Util/Identifiers/UuidHelper";
import {getMerchantFlag, getSellPrice} from "../Flag/MerchantFlag";
import {removeItem} from "../../../Util/Helper/ItemTransferHelper";
import {addGold} from "../../../Util/Helper/GoldHelper";

interface SellItem {
    itemId: UUID,
    qty: number
}

interface SellAction {
    merchant: UUID,
    items: SellItem[]
}

export const MerchantSell = registerGMSocket<SellAction>("MerchantSheet_Sell", async ({merchant: merchantId, items }) => {
    let merchant = (await loadActor(merchantId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    await Promise.all(items.map(async ({itemId, qty}) => {
        let item = (await loadItem(itemId))!
        let self = item?.actor!
        let price = getSellPrice(item, qty, merchantFlag)
        await removeItem(itemId, qty)
        //await addItem(item.data, merchantId, qty)
        await addGold(self, price)
    }))
})
import {registerGMSocket} from "Util/Socket/SocketHelper";
import {loadActor} from "Util/Identifiers/UuidHelper";
import {TokenSettings} from "Token/TokenSettings";
import {getMerchantFlag, getSellPrice} from "../Flag/MerchantFlag";
import {getSellDesireItems} from "../../LootSheet/Desire/SellDesireButton";
import {itemQty} from "Util/Extension/Items";
import {removeItem} from "Util/Helper/ItemTransferHelper";
import {addGold} from "Util/Helper/GoldHelper";

interface SellJunkAction {
    merchant: UUID,
    users: string[]
}

export const MerchantSellJunk = registerGMSocket<SellJunkAction>("MerchantSheet_SellJunk", async ({
                                                                                                      merchant: merchantId,
                                                                                                      users
                                                                                                  }) => {
    let merchant = (await loadActor(merchantId))!
    let holderId = TokenSettings.value.sellLootDump!
    let holder = (await loadActor(holderId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    let items = getSellDesireItems(holder)
    let totalPrice = 0
    let messages: string[] = []
    for (let item of items) {
        let qty = itemQty(item)
        let price = getSellPrice(item, qty, merchantFlag)
        totalPrice += price
        messages.push(`Selling ${item.name} x ${qty} for ${price}`)
        await removeItem(item.uuid, qty)
    }
    await holder.update({sort: (holder.sort ?? 0) + 1})
    let split = totalPrice / users.length
    for (let user of users) {
        let actor = game.users!.get(user)!.character!
        messages.push(`Giving ${actor.name} gold x ${split} from the proceeds`)
        await addGold(actor, split)
    }
    await ChatMessage.create({content: messages.join("<br/>")})
})
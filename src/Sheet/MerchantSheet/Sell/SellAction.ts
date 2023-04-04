import {registerGMSocket} from "../../../Util/Socket/SocketHelper";
import {loadActor, loadItem} from "../../../Util/Identifiers/UuidHelper";
import {getMerchantFlag, getSellPrice} from "../Flag/MerchantFlag";
import {addItem, removeItem} from "../../../Util/Helper/ItemTransferHelper";
import {addGold} from "../../../Util/Helper/GoldHelper";
import {getPartyUUIDs, isPartyCargoHolder} from "../../../Token/TokenSettings";
import {Messages} from "../../../Util/Messages";

interface SellItem {
    itemId: UUID,
    qty: number
}

interface SellAction {
    merchant: UUID,
    items: SellItem[]
}

function add(dist: Record<UUID, number>, uuid: UUID, gold: number) {
    dist[uuid] = (dist[uuid] ?? 0) + gold
}

export const MerchantSell = registerGMSocket<SellAction>("MerchantSheet_Sell", async ({merchant: merchantId, items }) => {
    let merchant = (await loadActor(merchantId))!
    let [merchantFlag] = getMerchantFlag(merchant)
    let messages = new Messages()
    let totalGoldDistribution: Record<UUID, number> = {}
    let party = getPartyUUIDs()
    await items.forEachAsync(async ({itemId, qty}) => {
        try {
            let item = (await loadItem(itemId))!
            let self = item?.actor!
            if(!self) return
            let price = getSellPrice(item, qty, merchantFlag)
            await removeItem(itemId, qty)
            await addItem(merchantId, item._source, {qty})
            if(isPartyCargoHolder(self) && party.length > 0) {
                let perMemberPrice = price / party.length
                messages.addMessage("Party is selling", item, "for", {type: "gp", value: price}, "=>", {type: "gp", value: perMemberPrice})
                party.forEach(p=>add(totalGoldDistribution, p, perMemberPrice))
            } else {
                messages.addMessage(self,"is selling", item, "for", {type: "gp", value: price})
                add(totalGoldDistribution, self.uuid, price)
            }
        } catch(e) {
            console.error("Error handling things", e)
        }
    })

    messages.addBreak()
    await Object.keys(totalGoldDistribution).forEachAsync(async (self)=>{
        let actor = await loadActor(self)
        if(!actor) return
        await addGold(actor, totalGoldDistribution[self])
        messages.addMessage(actor, "earned", {type: "gp", value: totalGoldDistribution[self]})
    })
    await messages.send()
})
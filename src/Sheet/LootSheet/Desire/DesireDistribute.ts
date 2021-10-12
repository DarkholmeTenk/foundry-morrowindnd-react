import getFlag from "../../../Util/Helper/FlagHelper";
import {DEFAULT_LOOT_FLAG, Desire, LOOT_FLAG_ID} from "../LootFlags";
import {ActorId, getActor} from "../../../Util/Identifiers/ActorID";
import {addItem, removeItem} from "../../../Util/Helper/ItemTransferHelper";
import {getItemId, OwnedItemId} from "../../../Util/Identifiers/ItemID";
import {TokenSettings} from "../../../Token/TokenSettings";
import {addSellFlag} from "./SellDesire";

function split<T>(qty: number, desirers: T[]): Map<T, number> {
    let map = new Map<T, number>()
    let ndes = desirers.length
    let base = Math.floor(qty / ndes)
    let remaining = qty - (base * ndes)
    desirers.forEach((t, i)=>{
        map.set(t, base + (i < remaining ? 1 : 0))
    })
    return map
}

function addFlags(type: String, itemData: any): any {
    if(type === "Sell") {
        return addSellFlag(itemData)
    } else {
        return itemData
    }
}

async function give(needers: ActorId[], loot: Actor, item: Item5e, type: String, result: String[]) {
    let qty = item.qty()
    let splitResult = split(qty, needers)
    await Promise.all(needers.map(async needId=>{
        let count = splitResult.get(needId) ?? 0
        if(count > 0) {
            let needActor = await getActor(needId)
            result.push(`Giving [${needActor.name}] [${item.name} x ${count}] for [${type}]`)
            await addItem(addFlags(type, item.data), needId, count)
        }
    }))
    await removeItem(getItemId(item) as OwnedItemId, qty)
}

export async function distributeDesires(loot: Actor5e): Promise<String[]> {
    let result: String[] = []
    let [flag] = getFlag(loot, LOOT_FLAG_ID, DEFAULT_LOOT_FLAG)
    for (let desires of flag.desires) {
        let item = loot.items.get(desires.itemId)
        if(!item) continue
        let needs = desires.players.filter(x=>x.desire == Desire.NEED)
        if(needs.length > 0) {
            await give(needs.map(x=>x.player), loot, item, "Need", result)
            continue
        }
        let greeds = desires.players.filter(x=>x.desire == Desire.GREED)
        if(greeds.length > 0) {
            await give(greeds.map(x=>x.player), loot, item, "Greed", result)
            continue
        }
        let sells = desires.players.filter(x=>x.desire == Desire.SELL)
        if(sells.length > 0) {
            await give([TokenSettings.value.sellLootDump!], loot, item, "Sell", result)
        }
    }
    return result
}
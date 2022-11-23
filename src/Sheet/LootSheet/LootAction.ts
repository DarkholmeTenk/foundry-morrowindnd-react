import {registerGMSocket} from "../../Util/Socket/SocketHelper";
import {getGoldDetails} from "./LootSheetGoldUtil";
import {getGoldBreakdown, NoActorCurrency} from "../../Util/Helper/GoldHelper";
import {CurrencyItem} from "../../RollTable/Rolling/TableGoldHelper";
import {addItem, removeItem} from "../../Util/Helper/ItemTransferHelper";
import {DEFAULT_LOOT_FLAG, Desire, ItemDesire, LOOT_FLAG_ID} from "./LootFlags";
import getFlag from "../../Util/Helper/FlagHelper";
import {isEqual} from "../../Util";
import {distributeDesires} from "./Desire/DesireDistribute";
import {loadActor, loadItem} from "../../Util/Identifiers/UuidHelper";

interface LootTakeSocketAction {
    selfId: UUID,
    lootId: UUID,
    qty: number
}
export const LootTakeSocket = registerGMSocket<LootTakeSocketAction>("LootSheet_Take", async ({selfId, lootId,  qty})=>{
    let itemData = await removeItem(lootId, qty)
    await addItem(selfId, itemData, {qty})
})

interface LootSplitGoldAction {
    lootId: UUID
}
export const LootSplitGold = registerGMSocket<LootSplitGoldAction>("LootSheet_SplitGold", async({lootId})=>{
    let actor = loadActor.sync(lootId)!
    let {takers, splitAmount} = getGoldDetails(actor)
    let breakdown = getGoldBreakdown(splitAmount)
    let count = 0
    for(let key of Object.keys(takers)) {
        let user = game.users!.get(key)
        if(takers[key] && user && user.character) {
            let item = new CurrencyItem(breakdown)
            let modifier = item.getModifications(user.character._source)
            await user.character.update(modifier)
            count++
        }
    }
    if(count > 0) {
        await actor.update({"data.currency": NoActorCurrency})
    }
})

interface MarkLootDesireAction {
    selfId: UUID,
    lootId: UUID,
    desire: Desire | null
}
export const MarkLootDesire = registerGMSocket<MarkLootDesireAction>(LOOT_FLAG_ID, async({selfId, lootId, desire})=>{
    let lootItem = loadItem.sync(lootId)!
    let lootOwner = lootItem.actor!
    let [flag, setFlag] = getFlag(lootOwner, LOOT_FLAG_ID, DEFAULT_LOOT_FLAG)
    let existing : ItemDesire = flag.desires.find(x=>x.itemId === lootItem.id) || {itemId: lootItem.id, players: []}
    let op = existing.players.filter(x=>!isEqual(x.player, selfId))
    let np = desire !== null ? [
            ...op,
            {player: selfId, desire}
        ] : op
    let newFlag = {
        ...flag,
        desires: [
            ...flag.desires.filter(x=>x.itemId !== lootItem.id),
            {
                ...existing,
                players: np
            }
        ]
    }
    await setFlag(newFlag)
})

interface LootSplitNGSArgs {
    lootId: UUID
}
export const LootSplitNGS = registerGMSocket<LootSplitNGSArgs>("LootSheet_SplitNGS", async ({lootId})=> {
    let loot = loadActor.sync(lootId)!
    let results = await distributeDesires(loot)
    let chatContent = results.join("<br/>")
    await ChatMessage.create({content: chatContent})
})
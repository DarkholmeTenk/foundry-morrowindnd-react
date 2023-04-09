import getFlag from "../../Util/Helper/FlagHelper";
import {getGoldAmountFromActor} from "Util/Helper/GoldHelper";
import {getPartyUUIDs} from "Settings/token/TokenSettings";

export enum Desire {
    NEED,
    GREED,
    SELL
}

type PlayerDesire =  {
    player: UUID,
    desire: Desire
}

export interface ItemDesire {
    itemId: string
    players: PlayerDesire[]
}

export interface LootFlag {
    desires: ItemDesire[],
    goldTakers: UUID[]
}

const LOOT_FLAG_ID = "LootSheet"

function getDefaultLootFlag(): LootFlag {
    return {desires: [], goldTakers: getPartyUUIDs()}
}

export function getLootFlag(x: Actor5e | TokenDocument) {
    let doc = x
    if(x instanceof Actor && x.token) doc = x.token
    return getFlag(doc, LOOT_FLAG_ID, getDefaultLootFlag())
}

export type MappedDesires = Map<string, Map<string, Desire>>
export function buildDesireMap(desires: ItemDesire[]): MappedDesires {
    let map = new Map<string, Map<string, Desire>>()
    desires.forEach(x=>{
        let playMap = new Map<string, Desire>()
        x.players.forEach(({player, desire})=>playMap.set(player, desire))
        map.set(x.itemId, playMap)
    })
    return map
}

export function getLootGoldDetails(npc: Actor5e) {
    let amount = getGoldAmountFromActor(npc)
    let [flag] = getLootFlag(npc)

    let takers = flag.goldTakers ?? getPartyUUIDs()
    if(!Array.isArray(takers)) takers = getPartyUUIDs()
    let takeCount = takers.length
    let splitAmount = amount / (takeCount || 1)
    return {takers, amount, splitAmount, takeCount}
}
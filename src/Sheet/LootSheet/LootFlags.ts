import getFlag from "../../Util/Helper/FlagHelper";

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
    goldTakers: string[]
}

const DEFAULT_LOOT_FLAG: LootFlag = {desires: [], goldTakers: []}
const LOOT_FLAG_ID = "LootSheet"

export function getLootFlag(x: Actor5e | TokenDocument) {
    let doc = x
    if(x instanceof Actor && x.token) doc = x.token
    return getFlag(doc, LOOT_FLAG_ID, DEFAULT_LOOT_FLAG)
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
import {ActorId} from "../../Util/Identifiers/ActorID";

export enum Desire {
    NEED,
    GREED,
    SELL
}

type PlayerDesire =  {
    player: ActorId,
    desire: Desire
}

export interface ItemDesire {
    itemId: string
    players: PlayerDesire[]
}
export interface LootFlag {
    desires: ItemDesire[]
}

export const DEFAULT_LOOT_FLAG: LootFlag = {desires: []}
export const LOOT_FLAG_ID = "LootSheet_MarkLootDesire"

export type MappedDesires = Map<string, Map<string, Desire>>
export function buildDesireMap(desires: ItemDesire[]): MappedDesires {
    let map = new Map<string, Map<string, Desire>>()
    desires.forEach(x=>{
        let playMap = new Map<string, Desire>()
        x.players.forEach(({player, desire})=>playMap.set((player as any).actorId, desire))
        map.set(x.itemId, playMap)
    })
    return map
}
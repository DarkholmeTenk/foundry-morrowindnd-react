import {SystemEntry} from "../../DocumentBase";

export interface ActorSpells {
    value: number,
    max: number,
    override?: number
}

export interface ActorBaseSystemData {
    currency: CurrencyValues
    spells: Record<string, ActorSpells>
}

export interface ActorCharacterData extends ActorBaseSystemData {}
export type ActorCharacterEntry = SystemEntry<"character", ActorCharacterData>

export interface ActorNpcData extends ActorBaseSystemData{}
export type ActorNpcEntry = SystemEntry<"npc", ActorNpcData>

export type ActorSystem = ActorCharacterEntry | ActorNpcEntry
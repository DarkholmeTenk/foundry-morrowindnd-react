import {SystemEntry} from "../../DocumentBase";

export interface ActorBaseSystemData {
    currency: CurrencyValues
}

export interface ActorCharacterData extends ActorBaseSystemData {}
export type ActorCharacterEntry = SystemEntry<"character", ActorCharacterData>

export interface ActorNpcData extends ActorBaseSystemData{}
export type ActorNpcEntry = SystemEntry<"npc", ActorNpcData>

export type ActorSystem = ActorCharacterEntry | ActorNpcEntry
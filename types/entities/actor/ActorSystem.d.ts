import {SystemEntry} from "../../DocumentBase";

export {}
declare global {
    interface ActorSpells {
        value: number,
        max: number,
        override?: number
    }

    interface ActorBaseSystemData {
        currency: CurrencyValues
        spells: Record<string, ActorSpells>
    }

    interface ActorCharacterData extends ActorBaseSystemData {}
    type ActorCharacterEntry = SystemEntry<"character", ActorCharacterData>

    interface ActorNpcData extends ActorBaseSystemData{}
    type ActorNpcEntry = SystemEntry<"npc", ActorNpcData>

    type ActorSystem = ActorCharacterEntry | ActorNpcEntry
}

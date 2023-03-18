import {ActorCharacterEntry, ActorNpcEntry} from "../entities/actor/ActorSystem";

export {}
declare global {
    const dnd5e: {

    }
    const ActorSheet5eCharacter: typeof FormApplication<ActorCharacterEntry>
    const ActorSheet5eNPC: typeof FormApplication<ActorNpcEntry>
}
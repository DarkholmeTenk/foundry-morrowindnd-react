import {ActorSystem} from "./ActorSystem";

export {}

declare global {
    class Actor extends DocumentBase {
        items: DocumentCollection<Item5e>
        img: string
        isToken: boolean
        token?: TokenDocument
        classes: Record<string, ItemClass>
        system: any
    }

    type Actor5e = ActorSystem & Actor
}
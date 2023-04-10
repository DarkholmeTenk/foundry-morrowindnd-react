export {}

declare global {
    class Actor extends DocumentBase {
        items: DocumentCollection<Item5e>
        img: string
        isToken: boolean
        token?: TokenDocument
        classes: Record<string, ItemClass & {subclass: ItemClass | undefined}>
        system: any
    }

    type Actor5e = ActorSystem & Omit<Actor, keyof ActorSystem> & Actor

    class Actors extends WorldCollection<Actor5e> {
        static registerSheet(scope: string, sheet: typeof DocumentSheet<Actor5e>, options: any)
    }
}
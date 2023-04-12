export {}

declare global {
    class TokenDocument extends DocumentBase {
        actor: Actor5e
        x: number
        y: number
        parent: Scene
        isLinked: boolean;
        texture: {
            src: string
        }
        width: number;
        height: number

        updateSource(update: any)
    }
    type Token = TokenDocument
}
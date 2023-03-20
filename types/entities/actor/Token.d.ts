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
    }
    type Token = TokenDocument
}
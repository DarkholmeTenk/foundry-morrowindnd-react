export {}

declare global {
    class TokenDocument extends DocumentBase {
        actor: Actor5e
        x: number
        y: number
        parent: Scene
    }
    type Token = TokenDocument
}
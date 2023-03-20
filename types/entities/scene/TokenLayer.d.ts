export {}

declare global {
    interface CanvasToken {
        document: TokenDocument
        x: number
        y: number
        w: number
        h: number
    }

    class TokenLayer {
        controlled: CanvasToken[]
    }
}
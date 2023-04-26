export {}

declare global {
    let canvas: {
        grid: GridLayer;
        scene?: Scene
        tokens: TokenLayer
    }
}
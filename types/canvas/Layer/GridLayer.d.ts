export {}

declare global {
    interface GridData {
        getGridPositionFromPixels(x: number, y: number): [number, number]
        getPixelsFromGridPosition(x: number, y: number): [number, number]
    }

    class GridLayer extends CanvasLayer {
        grid: GridData
        getSnappedPosition(x: number, y: number): {x: number, y: number}
        getCenter(x: number, y: number): [number, number]
        w: number
        h: number
        isHex: boolean
    }
}
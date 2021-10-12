export interface HasPosition {
    x: number,
    y: number
}
export function getDistance(a: HasPosition, b: HasPosition) {
    return Math.sqrt(
        ((a.x - b.x) ** 2) +
        ((a.y - b.y) ** 2)
    )
}
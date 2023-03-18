export {}

declare global {
    interface RollTableDraw {
        roll: Roll
        results: RealTableResult[]
    }

    class RollTable extends DocumentBase {
        roll(options?: {roll?: Roll, recursive?: boolean}): Promise<RollTableDraw>
    }
}
export {}

declare global {
    interface TextRollResult {
        type: 0
        text: string
    }

    interface DocumentRollResult {
        type: 1,
        documentCollection: string,
        documentId: string
    }

    interface CompendiumRollResult {
        type: 2
        documentCollection: string,
        documentId: string
    }

    class TableResult {
        type: 0 | 1 | 2
        range: [number, number]
    }

    type RealTableResult = TableResult & (TextRollResult | DocumentRollResult | CompendiumRollResult)
}
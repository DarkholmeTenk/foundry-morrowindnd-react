export {}

declare global {
    enum RollType {
        TEXT = 0,
        DOCUMENT = 1,
        COMPENDIUM = 2
    }
    interface TextRollResult {
        type: RollType.TEXT
        text: string
    }

    interface DocumentRollResult {
        type: RollType.DOCUMENT,
        documentCollection: string,
        documentId: string
    }

    interface CompendiumRollResult {
        type: RollType.COMPENDIUM
        documentCollection: string,
        documentId: string
    }

    class TableResult {
        type: RollType
        range: [number, number]
    }

    type RealTableResult = TableResult & (TextRollResult | DocumentRollResult | CompendiumRollResult)
}
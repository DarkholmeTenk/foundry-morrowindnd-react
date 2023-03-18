export {}
declare global {
    const Journal: typeof game.journal

    class JournalEntry extends DocumentBase {
        static create(data: unknown): Promise<JournalEntry>
    }
}
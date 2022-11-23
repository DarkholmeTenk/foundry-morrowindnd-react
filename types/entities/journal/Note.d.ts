export {}

declare global {
    class NoteDocument extends DocumentBase {
        x: number
        y: number
        entryId: string
        entry: JournalEntry
    }
}
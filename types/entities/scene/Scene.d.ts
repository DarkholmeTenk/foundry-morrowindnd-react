export {}

declare global {
    class Scene extends DocumentBase {
        notes: DocumentCollection<NoteDocument>
        tokens: DocumentCollection<TokenDocument>
    }
}
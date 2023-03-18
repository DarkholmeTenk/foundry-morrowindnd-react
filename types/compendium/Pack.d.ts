export {}

declare global {
    class CompendiumCollection<T extends DocumentBase> {
        get(key: string): object
        getIndex(): Promise<Record<string, object>>
        getDocument(key: string): Promise<T>
        getDocuments(query?: object): Promise<T[]>
        metadata: {
            id: string
            name: string,
            type: string,
            label: string,
            package: string
        }
    }
    type Pack<T extends DocumentBase> = CompendiumCollection<T>
}
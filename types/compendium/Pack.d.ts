export {}

declare global {
    class CompendiumCollection<T> {
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
    type Pack<T> = CompendiumCollection<T>
}
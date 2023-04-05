export {}

declare global {
    class Folder extends DocumentBase {
        static create(...args: any[]): Promise<Folder>
    }
}
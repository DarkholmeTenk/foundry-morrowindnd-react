export {}

type PermValue = 0 | 1 | 2 | 3 | undefined

export interface SystemEntry<S, V> {
    type: S,
    system: V
}

declare global {
    type Tester<T> = (value: any)=>value is T
    type UUID = string

    interface DocumentBaseData {
        ownership: Record<string, PermValue>
        name: string,
        flags: {[scope: string]: {[flag: string]: any}}
    }

    class DocumentBase implements DocumentBaseData {
        id: string
        uuid: UUID
        name: string
        ownership: Record<string, PermValue>

        _source: any
        documentName: string

        sort?: number
        sheet?: FormApplication<any>

        isOwner: boolean
        parent?: DocumentBase
        compendium?: Pack<any>
        flags: Record<string, Record<string, any>>
        hasPlayerOwner: boolean

        getFlag<T>(scope: string, flag: string): T | undefined
        setFlag<T>(scope: string, flag: string, value: T): Promise<void>
        unsetFlag(scope: string, flag: string): Promise<void>

        update(data: any, context?: any): Promise<void>
        delete(): Promise<void>

        createEmbeddedDocuments(name: string, data: any, context?: any): Promise<void>
        updateEmbeddedDocuments(name: string, update: any, context?: any): Promise<void>
        deleteEmbeddedDocuments(name: string, uuids: UUID[]): Promise<void>
    }

    function fromUuid(uuid: UUID): Promise<unknown | undefined>
    function fromUuidSync(uuid: UUID): unknown | undefined

    abstract class DocumentSheet<T extends DocumentBase> extends FormApplication<T>{
        document: T
    }

    abstract class WorldCollection<T> {
    }
}
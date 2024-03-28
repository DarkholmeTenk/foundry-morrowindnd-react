export {}

type Key = string | number | symbol
declare global {
    interface MergeOptions {
        insertKeys?: boolean,
        insertValues?: boolean,
        overwrite?: boolean,
        recursive?: boolean,
        inplace?: boolean
    }
    function mergeObject<A,B>(a: A, b: B, options?: MergeOptions): A & B
    function getProperty(obj: any, key: string): any
    function setProperty(obj: any, key: string, value: any): boolean
    function invertObject<A extends Key, B extends Key>(obj: Record<A,B>): Record<B, A>
    function deepClone<T>(object: T): T
    function randomID(length? : number): string

    interface Number {
        toNearest: (interval?: number, method?: "round" | "ceil" | "floor")=>number
    }

    interface Window {
        MorrowinDnDReact: any
    }
}
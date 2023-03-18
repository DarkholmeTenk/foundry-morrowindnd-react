export {}

type Key = string | number | symbol
declare global {
    function mergeObject<A,B>(a: A, b: B): A & B
    function getProperty(obj: any, key: string): any
    function setProperty(obj: any, key: string, value: any): boolean
    function invertObject<A extends Key, B extends Key>(obj: Record<A,B>): Record<B, A>

    interface Number {
        toNearest: (interval?: number, method?: "round" | "ceil" | "floor")=>number
    }
}
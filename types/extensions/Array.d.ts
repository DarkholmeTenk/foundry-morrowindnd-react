export {}
declare global {
    interface Array<T> {
        forEachAsync(fun: (item: T, index: number)=>Promise<unknown>): Promise<unknown>
        forEachAsyncOrdered(fun: (item: T, index: number)=>Promise<unknown>): Promise<unknown>
        mapAsync<U>(fun: (item: T, index: number)=>Promise<U>): Promise<U[]>
    }
}
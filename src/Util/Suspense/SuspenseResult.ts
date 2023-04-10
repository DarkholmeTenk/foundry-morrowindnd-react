interface LoadingResult<T> {
    loading: true,
    result: null,
    promise: Promise<T>
}
interface LoadedResult<T> {
    loading: false,
    result: T,
    promise: undefined
}
export type SuspenseResult<T> = (LoadingResult<T> | LoadedResult<T>) & {count: number, id: number}

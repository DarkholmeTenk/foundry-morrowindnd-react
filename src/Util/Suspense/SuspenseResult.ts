interface LoadingResult<T> {
    loading: true
    error?: undefined
    result: null
    promise: Promise<T>
}
interface LoadedResult<T> {
    loading: false
    error?: undefined
    result: T
    promise: undefined
}
interface ErroredResult<T> {
    loading: false,
    error: {value: any}
    result: null
    promise: undefined
}
export type SuspenseResult<T> = (LoadingResult<T> | LoadedResult<T> | ErroredResult<T>) & {count: number, id: number}

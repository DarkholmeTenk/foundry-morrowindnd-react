import {SuspenseResult} from "Util/Suspense/SuspenseResult";

export class SuspenseCache {
    results: Record<string, SuspenseResult<unknown>> = {}
    index: number = 0

    constructor(private refresh: ()=>void) {
    }

    get<T>(key: string, generator: ()=>Promise<T>): SuspenseResult<T> {
        if(this.results[key]) return this.results[key] as SuspenseResult<T>
        console.log(`Suspense generating promise [${key}]`)
        let promise = generator()
        let value: SuspenseResult<T> = {
            loading: true,
            promise: promise,
            result: null,
            count: 0,
            id: this.index++
        }
        promise.then(r=>{
            value.loading = false
            value.promise = undefined
            value.result = r
        }).catch(r=>{
            value.loading = false
            value.error = {value: r}
            value.promise = undefined
        })
        this.results[key] = value
        return value
    }

    private getWithId(key: string, id: number): SuspenseResult<unknown> | undefined {
        let r = this.results[key]
        if (r) {
            if (r.id !== id) {
                console.log("Id mismatch")
                return undefined
            }
            return r
        }
        return undefined
    }

    watch(key: string, id: number) {
        let r = this.getWithId(key, id)
        if(r) {
            r.count++
            console.log(`Suspense watched [${key}] [${r.count}]`)
        } else {
            console.log(`Suspense failed to watch [${key}]`)
        }
    }

    unwatch(key: string, id: number) {
        let r = this.getWithId(key, id)
        if(r) {
            r.count--
            console.log(`Suspense uwatched [${key}] [${r.count}]`)
            if(r.count <= 0) {
                this.clear(key)
            }
        }
    }

    clear(key: string) {
        if(this.results[key]) {
            this.results[key].id = -1
        }
        delete this.results[key]
        this.refresh()
    }
}
export type Comparator<T> = (a:T, b: T)=>number

export function chainSort<T>(...comparators: Comparator<T>[]): Comparator<T> {
    return (a,b)=>{
        for(let c of comparators) {
            let r = c(a,b)
            if(r != 0) return r
        }
        return 0
    }
}

export function mapSort<T, U>(map: (t: T)=>U, comparator: Comparator<U>): Comparator<T> {
    return (a,b)=>comparator(map(a), map(b))
}

export const StringSorter: Comparator<string> = (a,b)=>a.localeCompare(b)
export const NumSorter: Comparator<number> = (a, b)=>a - b
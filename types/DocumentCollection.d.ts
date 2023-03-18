interface DocumentCollection<T> {
    getName(name: string): T | undefined
    get(id: string): T | undefined
    contents: T[]
    map<U>(transformer: (value: T, index: number)=>U): U[]
    forEach(iterator: (value: T, index: number)=>void): void
    filter(filter: (value: T, index: number)=>boolean): T[]
    find(filter: (value: T, index: number)=>boolean): T | undefined
}
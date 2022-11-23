interface DocumentCollection<T> {
    getName(name: string): T | undefined
    get(id: string): T | undefined
    contents: T[]
    map<U>(transformer: (value: T, index: number)=>U): U[]
    filter(filter: (value: T, index: number)=>boolean): T[]
    find(filter: (value: T, index: number)=>boolean): T | undefined
}
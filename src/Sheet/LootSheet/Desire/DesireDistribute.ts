function split<T>(qty: number, desirers: T[]): Map<T, number> {
    let map = new Map<T, number>()
    let ndes = desirers.length
    let base = Math.floor(qty / ndes)
    let remaining = qty - (base * ndes)
    desirers.forEach((t, i)=>{
        map.set(t, base + (i < remaining ? 1 : 0))
    })
    return map
}
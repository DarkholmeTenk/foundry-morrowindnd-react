import "./Hooks"
import "./Socket"
import "./Extension"

export function randomIndex(array) {
    return Math.floor(Math.random() * array.length)
}

function inDepth(a, b, key, differences, ignore) {
    if(ignore[key] === true) { return true }
    let aVal = a[key]
    let bVal = b[key]
    if(typeof(aVal) !== typeof(bVal)) {
        differences[key] = true
        return false
    } else if(typeof(aVal) === "object") {
        let result = isEqualDetailed(aVal, bVal, ignore[key] || {})
        if(!result.equal) differences[key] = result.differences
        return result.equal
    } else {
        let result = aVal === bVal
        if(!result) differences[key] = true
        return result
    }
}

export function isEqualDetailed(a, b, ignore = {}) {
    let differences  = {}
    if(typeof(a) !== typeof(b)) return {equal: false, differences: "EVERYTHING"}
    if(a === b) return {equal: true, differences: {}}
    if(a === null || a === undefined) { return {equal: b === null || b === undefined, differences: "NULLS"} }
    let aDifferences = Object.keys(a).filter(key=>{
        return !inDepth(a,b,key, differences, ignore)
    })
    let bNewKey = Object.keys(b).filter(key=>!(ignore[key] === true) && !(key in a))
    bNewKey.forEach(b=>differences[b] = true)
    return {equal: aDifferences.length === 0 && bNewKey.length === 0, differences}

}

export function isEqual(a, b, ignore = {}) {
    return isEqualDetailed(a, b, ignore).equal
}


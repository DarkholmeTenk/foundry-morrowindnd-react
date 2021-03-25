export function rehydrate(obj, clazz) {
    let result = {}
    Object.keys(obj).forEach(key=>result[key] = clazz.fromJSON(obj[key]))
    return result
}
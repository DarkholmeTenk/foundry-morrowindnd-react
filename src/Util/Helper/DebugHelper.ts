import LogFactory from "../Logging";

const Log = LogFactory("Debug")

export function debugTime<X>(name: string, fun: ()=>X): X {
    let st = window.performance.now()
    let r = fun()
    let et = window.performance.now()
    let ms = et - st;
    Log.debug(`${name} took ${ms}ms`)
    return r
}
export function e(callback) {
    return (x, ...rest)=>{
        x.preventDefault()
        x.stopPropagation()
        callback(x, ...rest)
    }
}
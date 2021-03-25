export function e(callback) {
    return (x, ...rest)=>{
        x.preventDefault()
        callback(x, ...rest)
    }
}
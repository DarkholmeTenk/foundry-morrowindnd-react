Array.prototype.mapAsync = function(fun) {
    return Promise.all(this.map(function(value, index) {
        return fun(value, index)
    }))
}

Array.prototype.forEachAsyncOrdered = async function(fun) {
    let i: any
    for (i in this) {
        if(isNaN(parseInt(i))) { continue }
        let value = this[i]
        await fun(value, i as number)
    }
}

Array.prototype.forEachAsync = function(fun) {
    return Promise.all(this.map(function(value, index) {
        return fun(value, index)
    }))
}
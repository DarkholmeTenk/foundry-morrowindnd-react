Array.prototype.forEachAsync = function(fun) {
    return Promise.all(this.map(function() {
        return fun(...arguments)
    }))
}

Array.prototype.forEachAsyncOrdered = async function(fun) {
    for (let i in this) {
        if(isNaN(parseInt(i))) { continue }
        let value = this[i]
        await fun(value, i, this)
    }
}

Array.prototype.mapAsync = Array.prototype.forEachAsync
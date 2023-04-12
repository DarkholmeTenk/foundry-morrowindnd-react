function toMap(things) {
    let map = {}
    things.forEach(x=>map[x.name] = x)
    return map
}


export function listFiles({storage="data", target="", extensions=[], bucket=""}): Promise<{dirs: any, files: any, dirMap: any, fileMap: any}> {
    return new Promise((resolve, reject)=>{
        game.socket.emit("manageFiles", {action: "browseFiles", storage, target}, {extensions, bucket}, result=>{
            if(result.error) return reject(result.error)
            let dirs = result.dirs.map(dir=>new Folder({storage, target: dir, extensions, bucket}))
            let files = result.files.map(file=>new File({path: file}))
            let dirMap = toMap(dirs)
            let fileMap = toMap(files)
            let newResult = {dirs, files, dirMap, fileMap}
            resolve(newResult)
        })
    })
}

class Folder {
    constructor(private data: any) {
    }

    browse() {
        return listFiles(this.data)
    }

    get path() {
        return this.data.target
    }

    get name() {
        return this.path.substring(this.path.lastIndexOf("/") + 1)
    }
}

class File {
    constructor(private data: any) {
    }

    get path() {
        return this.data.path
    }

    get name() {
        return this.path.substring(this.path.lastIndexOf("/") + 1)
    }
}
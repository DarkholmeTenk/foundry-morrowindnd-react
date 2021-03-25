const ID = "module.MorrowinDnDReact"

type DataCallback<X> = (data: X)=>void

type SocketHookHolder = {[id: string]: DataCallback<any>}

let SocketHooks: SocketHookHolder = {};

Hooks.on("ready", ()=> {
    (game.socket as any).on(ID, result => {
        let id = result.id
        let payload = result.payload
        SocketHooks[id](payload)
    })
})

export function registerSocket<X>(id: string, callback: DataCallback<X>): DataCallback<X> {
    SocketHooks[id] = callback
    return (payload)=>{
        callback(payload);
        (game.socket as any).emit(ID, {id, payload})
    }
}

export function registerGMSocket<X>(id: string, callback: DataCallback<X>): DataCallback<X> {
    return registerSocket(id, (x)=>{
        if(!game.users.entities.some(u=>u.isGM)) {
            ui.notifications.error("A GM must be online to perform this action")
            throw new Error("No GM Available")
        }
        if(game.user.isGM) {
            callback(x)
        }
    })
}

export function registerPlayerSocket<X>(id: string, callback: DataCallback<X>): DataCallback<X> {
    return registerSocket(id, (x)=>{
        if(!game.user.isGM) {
            callback(x)
        }
    })
}
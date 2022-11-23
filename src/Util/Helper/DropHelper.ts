import LogFactory from "../Logging";
import {Entity} from "./EntityHelper";

const log = LogFactory("DropHelper")

const map = ()=>({
    "Item": {cons: Item, coll: game.items},
    "Actor": {cons: Actor, coll: game.actors},
    "JournalEntry": {cons: JournalEntry, coll: game.journal},
    "Scene": {cons: Scene, coll: game.scenes},
    "RollTable": {cons: RollTable, coll: game.tables},
})

async function loadThing(event) {
    let data = JSON.parse(event.dataTransfer.getData('text/plain'));
    if(!data.type) {
        return
    }
    if(data.pack) {
        log("Searching pack for id", data.pack, data.id)
        let pack = game.packs.get(data.pack)!
        return await pack.getDocument(data.id)
    } else if(data.actorId) {
        return game.actors!.get(data.actorId)!.items.get(data.data._id)
    } else {
        let type = map()[data.type]
        if(!type) {
            return null
        }
        if(data.data) {
            return new type.cons(data.data)
        } else {
            return await type.coll.get(data.id)
        }
    }
}

export function onDrop(callback: (i: Entity)=>void) {
    return async (e)=>{
        e.preventDefault()
        e.stopPropagation()
        let object = await loadThing(e)
        if(object) {
            callback(object)
        }
    }
}

export function onItemDrop(callback: (i: Item)=>void) {
    return onDrop(x=>{
        if(x instanceof Item) {
            callback(x)
        }
    })
}
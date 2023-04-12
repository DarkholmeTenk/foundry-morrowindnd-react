import LogFactory from "../Logging";
import {DragEventHandler} from "react";
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
        } else if(data.id) {
            return await type.coll.get(data.id)
        } else if(data.uuid) {
            return await fromUuid(data.uuid)
        }
    }
}

function getData(x: DocumentBase): object | undefined {
    if(x instanceof Item) {
        let b = {type: "Item", uuid: x.uuid}
        if(x.compendium) {
            return {...b, pack: x.compendium.metadata.id, id: x.id}
        } else if(!x.parent) {
            return {...b, id: x.id}
        }
        return b
    }
}

export function useDragHandler(x: any): DragEventHandler<any> | undefined {
    let data = getData(x)
    if(data) {
        return (e) => {
            if (data)
                e.dataTransfer.setData('text/plain', JSON.stringify(data))
        }
    } else return undefined

}

export function onDrop(callback: (i: DocumentBase)=>void) {
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
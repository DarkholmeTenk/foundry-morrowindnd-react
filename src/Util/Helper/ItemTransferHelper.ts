import LogFactory from "../Logging";
import {itemQty} from "../Extension/Items";
import {loadActor, loadItem} from "../Identifiers/UuidHelper";

const Log = LogFactory("ItemTransferHelper")

export type AddableItemData = SmartItemData | SmartItemData[]

export interface ExtraAddItemOptions {
    qty?: number
}

export function fixItemData(itemData: any, options: ExtraAddItemOptions) {
    itemData = deepClone(itemData)
    if(options?.qty) {
        itemData.system.quantity = options.qty
    }
    return itemData
}

type ActorSource = UUID | Actor5e
function resolve(actorSource: ActorSource): Actor5e {
    if(actorSource instanceof Actor)
        return actorSource
    else
        return loadActor.sync(actorSource) as Actor5e
}
export async function addItem(actorSource: UUID | Actor5e, itemData: AddableItemData, options: ExtraAddItemOptions = {}) {
    let actor = resolve(actorSource)
    let itemArr = (Array.isArray(itemData) ? itemData : [itemData]).map(i => fixItemData(i, options))
    let updating: any[] = []
    let newArr: any[] = []
    itemArr.forEach(i=>{
        let existing = actor.items.find(x=>x.name == i.name)
        if(existing) {
            updating.push({_id: existing.id, "system.quantity": existing.qty() + (options.qty ?? i.system?.quantity ?? 1)})
        } else {
            newArr.push(i)
        }
    })
    if(updating.length > 0) {
        await actor.updateEmbeddedDocuments("Item", updating)
    }
    if(newArr.length > 0) {
        await actor.createEmbeddedDocuments("Item", newArr)
    }
}

export async function removeItem(itemId: UUID, qty: number): Promise<any> {
    let item = await loadItem(itemId)
    if(!item) return null
    let iQty = itemQty(item) || 1
    if(qty >= iQty) {
        await item.delete()
    } else {
        await item.update({"system.quantity": iQty - qty})
    }
    return item._source
}
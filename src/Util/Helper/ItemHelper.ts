import LogFactory from "../Logging";
import {HoldableEntry} from "../../../types/entities/item/ItemSystem";

const log = LogFactory("ItemMerger")

export function isHoldable(itemData: SmartItemData): itemData is ItemData & HoldableEntry {
    return "price" in itemData.system || "weight" in itemData.system || "quantity" in itemData.system
}

export function mergeItemData(items: SmartItemData[]) {
    log.debug("Merging Items", items)
    let nameArr: Record<string, {oldVal: SmartItemData, newVal: SmartItemData}> = {}
    items.forEach(i=>{
        let lowerName = i.name.toLowerCase()
        if(nameArr[lowerName]) {
            let eH = nameArr[lowerName]
            if(eH.newVal == eH.oldVal) {
                eH.newVal = deepClone(eH.newVal)
            }
            let e = eH.newVal
            if(isHoldable(e) && isHoldable(i)) {
                e.system.quantity = (e.system.quantity ?? 1) + (i.system.quantity ?? 1)
            }
        } else {
            nameArr[lowerName] = {oldVal: i, newVal: i}
        }
    })
    let mergedItems = Object.values(nameArr).map(x=>x.newVal)
    log.debug("Merged items", mergedItems)
    return mergedItems
}

export async function getActorItems(actor: Actor): Promise<Item[]> {
    return actor.items.map(x=>x)
}
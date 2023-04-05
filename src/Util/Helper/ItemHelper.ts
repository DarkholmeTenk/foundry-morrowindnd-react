import LogFactory from "../Logging";

const log = LogFactory("ItemMerger")

type HID = ItemData & HoldableEntry
export function isHoldable(itemData: SmartItemData): itemData is HID {
    return "price" in itemData.system || "weight" in itemData.system || "quantity" in itemData.system
}

export function mergeItemData(items: SmartItemData[]) {
    log.debug("Merging Items", items)
    let nameArr: Record<string, {oldVal: SmartItemData, newVal: SmartItemData}> = {}
    items.forEach(i=>{
        let lowerName = i.name.toLowerCase()
        if(nameArr[lowerName]) {
            let existing = nameArr[lowerName]
            if(existing.newVal == existing.oldVal) {
                existing.newVal = deepClone(existing.newVal)
            }
            let newValue = existing.newVal
            if(isHoldable(newValue) && isHoldable(i)) {
                let nv: HID = newValue
                let iv: HID = i
                nv.system.quantity = (nv.system.quantity ?? 1) + (iv.system.quantity ?? 1)
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
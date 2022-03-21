import LogFactory from "../Logging";

const log = LogFactory("ItemMerger")

export function cloneItemData(i: any) {
    return { ...i, data: {...i.data} }
}

export function mergeItemData(items: any[]) {
    log.debug("Merging Items", items)
    let nameArr: Record<string, {oldVal: any, newVal: any}> = {}
    items.forEach(i=>{
        let lowerName = i.name.toLowerCase()
        if(nameArr[lowerName]) {
            let eH = nameArr[lowerName]
            if(eH.newVal == eH.oldVal) {
                eH.newVal = cloneItemData(eH.newVal)
            }
            let e = eH.newVal
            e.data.quantity = (e.data.quantity ?? 1) + (i.data.quantity ?? 1)
            e.isStack = e.data.quantity > 1
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
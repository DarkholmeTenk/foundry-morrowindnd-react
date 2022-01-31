import {clone, isEqual} from "..";
import LogFactory from "../Logging";

const log = LogFactory("ItemMerger")

const ignorableProperties = ["_id", "isStack", "hasUses", "hasTarget", "isOnCooldown", "isDepleted", "sort", "labels", "totalWeight"]
const ignorableDataProperties = ["quantity"]

let ignore = {data:{}}
ignorableProperties.forEach(p=>ignore[p] = true)
ignorableDataProperties.forEach(p=>ignore.data[p] = true)

export function mergeItemData(items: any[]) {
    log.debug("Merging Items", items)
    let nameArrs: {[key: string]: any} = {}
    items.forEach(i=>{
        let name = i.name
        let qty = parseInt(i.data.quantity || 1)
        let nameArr = nameArrs[name] || []
        let found = nameArr.find(({item})=>{
            return isEqual(i, item, ignore)
        })
        if(found) {
            log.debug("Found item for " + name, nameArr, i)
            found.qty += qty
        } else {
            log.debug("Not found item for " + name, nameArr, i)
            nameArr.push({item: i, qty})
        }
        nameArrs[name] = nameArr
    })
    let mergedItems = Object.values(nameArrs).flatMap(nameArr=>{
        return (nameArr.map(({item, qty})=>{
            if(qty === item.data.quantity || qty === 1) {
                return item
            } else {
                let newItem = clone(item)
                delete newItem._id
                newItem.data.quantity = qty
                newItem.isStack = qty > 1
                return newItem
            }
        }))
    })
    log.debug("Merged items", mergedItems)
    return mergedItems
}

export async function getActorItems(actor: Actor): Promise<Item[]> {
    return actor.items.map(x=>x)
}
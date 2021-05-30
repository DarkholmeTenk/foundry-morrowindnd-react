import {clone, isEqual} from "..";
import LogFactory from "../Logging";

const log = LogFactory("ItemMerger")

const ignorableProperties = ["_id", "isStack", "hasUses", "hasTarget", "isOnCooldown", "isDepleted", "sort", "labels", "totalWeight"]
const ignorableDataProperties = ["quantity"]

let ignore = {data:{}}
ignorableProperties.forEach(p=>ignore[p] = true)
ignorableDataProperties.forEach(p=>ignore.data[p] = true)

export function mergeItemData(items) {
    log.debug("Merging Items", items)
    let nameArrs = {}
    items.forEach(i=>{
        let name = i.name
        let qty = parseInt(i.data.quantity || 1)
        let nameArr = nameArrs[name] || []
        let found = nameArr.find(({item})=>{
            let val = isEqual(i, item, ignore)
            return val
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
        return nameArr.map(({item, qty})=>{
            if(qty == item.data.quantity || qty == 1) {
                return item
            } else {
                let newItem = clone(item)
                delete newItem._id
                newItem.data.quantity = qty
                newItem.isStack = qty > 1
                return newItem
            }
        })
    })
    log.debug("Merged items", mergedItems)
    return mergedItems
}
import {isEqualDetailed} from "@darkholme/foundry-react-core/src/Util/Util"
// @ts-ignore
import IgnoredProperties from "./MergerIgnoredProperties.json"

type Mapping = {[id: string]: {item: Item, differences: any}}

export function getItemMapping(items: Item[]): Mapping {
    let result: Mapping = {}
    items.forEach(item=>{
        let matchingItem = game.items.getName(item.name)
        if(matchingItem) {
            let equal = isEqualDetailed(item.data, matchingItem.data, IgnoredProperties)
            if(!equal.equal) {
                result[item.id] = {item: matchingItem, differences: equal.differences}
            }
        }
    })
    return result
}

function buildUpdate(item: Item, differences: any, key: string = "", result: any = {}) {
    Object.keys(differences).forEach(dKey=>{
        let newKey = key == "" ? dKey : `${key}.${dKey}`
        let diffVal = differences[dKey]
        let val = getProperty(item.data, newKey)
        if(diffVal === true || (typeof(val) === "object" && Array.isArray(val))) {
            result[newKey] = val === undefined ? null : val
        } else {
            buildUpdate(item, diffVal, newKey, result)
        }
    })
    return result
}

export async function doMerge(actor: Actor, mappings: Mapping, selected: {[itemId: string]: boolean}) {
    let toDo = Object.keys(selected).filter(key=>selected[key])
    let key = ""
    for (key of toDo) {
        let mapping = mappings[key]
        let update = buildUpdate(mapping.item, mapping.differences)
        let oItem = actor.getOwnedItem(key)
        await oItem.update(update)
    }
}
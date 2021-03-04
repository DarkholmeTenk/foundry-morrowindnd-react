import { isEqualDetailed } from "@darkholme/foundry-react-core/src/Util/Util";
// @ts-ignore
import IgnoredProperties from "./MergerIgnoredProperties.json";
export function getItemMapping(items) {
    let result = {};
    items.forEach(item => {
        let matchingItem = game.items.getName(item.name);
        if (matchingItem) {
            let equal = isEqualDetailed(item.data, matchingItem.data, IgnoredProperties);
            if (!equal.equal) {
                result[item.id] = { item: matchingItem, differences: equal.differences };
            }
        }
    });
    return result;
}
function buildUpdate(item, differences, key = "", result = {}) {
    Object.keys(differences).forEach(dKey => {
        let newKey = key == "" ? dKey : `${key}.${dKey}`;
        let diffVal = differences[dKey];
        if (diffVal === true) {
            let prop = getProperty(item.data, newKey);
            result[newKey] = prop === undefined ? null : prop;
        }
        else {
            buildUpdate(item, diffVal, newKey, result);
        }
    });
    return result;
}
export async function doMerge(actor, mappings, selected) {
    let toDo = Object.keys(selected).filter(key => selected[key]);
    let key = "";
    for (key of toDo) {
        let mapping = mappings[key];
        let update = buildUpdate(mapping.item, mapping.differences);
        let oItem = actor.getOwnedItem(key);
        await oItem.update(update);
    }
}

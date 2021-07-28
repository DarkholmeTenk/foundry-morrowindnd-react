import {getItem, isPackItem, ItemId} from "./ItemID";
import {ItemPackSetting} from "../../RollTable/Rolling/Settings";
import {loadPacks} from "./PackId";

async function getItemFromName(name: String): Promise<Item<any> | null> {
    let packIds = ItemPackSetting.value
    let packs = await loadPacks<Item<any>>(packIds)
    return packs.find(x=>x.name === name)
}

export async function getCanonicalItem(itemId: ItemId, name: String): Promise<Item<any> | null> {
    if(isPackItem(itemId)) {
        let item = await getItem(itemId)
        if(item != null && item.name === name) {
            return item
        }
    }
    return getItemFromName(name)
}
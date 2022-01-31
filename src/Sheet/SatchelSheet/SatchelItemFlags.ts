import {getItem, isPackItem, ItemId, ItemPackId} from "../../Util/Identifiers/ItemID";
import getFlag, {FlagResult} from "../../Util/Helper/FlagHelper";
import {isEqual} from "../../Util";
import {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";

interface ItemById {
    id: ItemPackId,
    name: string
    qty: number
}

interface SatchelFlags {
    itemData: ItemData[],
    ids: ItemById[],
    filter: string
}

const defaultSatchelFlags: SatchelFlags = {
    itemData: [],
    ids: [],
    filter: "Any"
}

type Satchel = FlagResult<Partial<SatchelFlags>>
export function getSatchelFlag(item: Item): FlagResult<Partial<SatchelFlags>> {
    return getFlag(item, "Satchel", defaultSatchelFlags)
}

function idQty(itemData: ItemData, qty: number): ItemData {
    return {
        ...itemData,
        data: {
            ...itemData.data,
            quantity: qty
        }
    } as any as ItemData
}

function removeItem(satchel: Satchel, itemId: ItemId, qty: number) {

}

export async function addItemToSatchel(satchel: Satchel, itemId: ItemId, qty: number) {
    let [flag, setFlag] = satchel
    let item = (await getItem(itemId))!
    if(!isPackItem(itemId)) {
        let newData = idQty(item.data, qty)
        await setFlag({
            ...flag,
            itemData: [
                ...(flag.itemData || []),
                newData
            ]
        })
    } else {
        let existing = (flag.ids || []).find(x=>isEqual(x.id, itemId))
        let newArr: ItemById[]
        if(existing) {
            newArr = (flag.ids || []).filter(x=>x !== existing)
            newArr.push({
                ...existing,
                qty: qty + existing.qty
            })
        } else {
            newArr = [
                ...(flag.ids || []),
                {
                    id: itemId,
                    name: item.name!,
                    qty
                }
            ]
        }
        await setFlag({
            ...flag,
            ids: newArr
        })
    }
}

export async function getSatchelItems(satchel: Satchel): Promise<Item[]> {
    let [flag] = satchel
    let items: Item[] = []
    for(let id of (flag.ids || [])) {
        let item = (await getItem(id.id))!
        let newId = idQty(item.data, id.qty) as any
        items.push((await Item.create(newId, {temporary: true}))!)
    }
    if(flag.itemData) {
        for (let data of (flag.itemData)) {
            items.push((await Item.create(data as any, {temporary: true}))!)
        }
    }
    return items
}
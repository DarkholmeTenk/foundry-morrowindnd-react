import {getItem, isOwnedItem, isPackItem, ItemId, ItemPackId} from "../../Util/Identifiers/ItemID";
import getFlag, {FlagResult} from "../../Util/Helper/FlagHelper";
import {isEqual} from "../../Util";

interface ItemById {
    id: ItemPackId,
    name: string
    qty: number
}

interface SatchelFlags {
    itemData: Item.Data<any>[],
    ids: ItemById[],
    filter: string
}

const defaultSatchelFlags: SatchelFlags = {
    itemData: [],
    ids: [],
    filter: "Any"
}

type Satchel = FlagResult<Partial<SatchelFlags>>
export function getSatchelFlag(item: Item<any>): FlagResult<Partial<SatchelFlags>> {
    return getFlag(item, "Satchel", defaultSatchelFlags)
}

function idQty(itemData: Item.Data<any>, qty: number): Item.Data<any> {
    return {
        ...itemData,
        data: {
            ...itemData.data,
            quantity: qty
        }
    }
}

function removeItem(satchel: Satchel, itemId: ItemId, qty: number) {

}

export async function addItemToSatchel(satchel: Satchel, itemId: ItemId, qty: number) {
    let [flag, setFlag] = satchel
    let item = await getItem(itemId)
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
        let newArr = []
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
                    name: item.name,
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

export async function getSatchelItems(satchel: Satchel): Promise<Item<any>[]> {
    let [flag] = satchel
    let items = []
    for(let id of (flag.ids || [])) {
        let item = await getItem(id.id)
        let newId = idQty(item.data, id.qty)
        items.push(await Item.create(newId, {temporary: true}))
    }
    for(let data of (flag.itemData)) {
        items.push(await Item.create(data, {temporary: true}))
    }
    return items
}
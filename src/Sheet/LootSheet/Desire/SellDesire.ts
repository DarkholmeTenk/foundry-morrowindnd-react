import getFlag, {FLAG_SCOPE} from "../../../Util/Helper/FlagHelper";

const sellFlag = "Desire_SELLME"

export function hasSellFlag(item: Item): boolean {
    let [flag] = getFlag(item, sellFlag, {sell: false})
    return flag.sell
}

export function addSellFlag(itemData: SmartItemData): SmartItemData {
    return mergeObject(itemData, {[FLAG_SCOPE]: {[sellFlag]: {sell: true}}})
}
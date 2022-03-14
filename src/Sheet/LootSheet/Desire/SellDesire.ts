import getFlag from "../../../Util/Helper/FlagHelper";

const sellFlag = "Desire_SELLME"

export function hasSellFlag(item: Item): boolean {
    let [flag] = getFlag(item, sellFlag, {sell: false})
    return flag.sell
}

export function addSellFlag(itemData: any): any {
    return {
        ...itemData,
        flags: {
            ...(itemData.flags || {}),
            MorrowinDnDReact: {
                ...(itemData.flags["MorrowinDnDReact"] || {}),
                [sellFlag]: {
                    sell: true
                }
            }
        }
    }
}
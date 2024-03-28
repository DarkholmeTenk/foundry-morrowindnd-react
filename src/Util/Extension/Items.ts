import {getGoldValue} from "../Helper/GoldHelper";

export function itemQty(item: Item | SmartItemData): number {
    if(item instanceof Item)
        return item.qty()
    else
        return ("quantity" in item.system ? item.system.quantity : undefined) ?? 0
}

export function itemPrice(item: Item): number {
    return item.price()
}

export function itemWeight(item: Item): number {
    return item.weight()
}

Item.prototype.weight = function(defaultWeight = 0) {
    return "weight" in this.system ? this.system.weight : defaultWeight
}

Item.prototype.qty = function (defaultQty = 0) {
    return "quantity" in this.system ? this.system.quantity : defaultQty
}

Item.prototype.price = function (defaultPrice = 0) {
    return "price" in this.system ? getGoldValue(this.system.price) : defaultPrice
}
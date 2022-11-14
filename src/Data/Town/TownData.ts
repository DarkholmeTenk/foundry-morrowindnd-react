import {ShopData} from "../Shop/ShopData";

export interface TownData extends HasLegendKeeper {
    regions: TownRegion[]
}

export interface TownRegion extends HasLegendKeeper {
    images: string[],
    shops: TownShop[],
    people: TownNpc[]
}

export interface TownShop {
    name: string
    shop: ShopData,
    vendor: TownNpc
}

export interface TownNpc extends HasLegendKeeper {
}
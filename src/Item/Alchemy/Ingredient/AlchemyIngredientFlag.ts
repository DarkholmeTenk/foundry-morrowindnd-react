import {getProperties} from "../../ItemProperties";

export interface AlchemyIngredientEffect {
    id: string,
    bonus?: number
}
export interface AlchemyIngredientFlag {
    effects: AlchemyIngredientEffect[]
}

export interface IngredientData {
    item: Item<any>,
    flag: AlchemyIngredientFlag
}
export function getIngredients(items: Item<any>[]): IngredientData[]  {
    return items.map(i=>({item: i, flag: getProperties(i)[0].alchemy})).filter(y=>y.flag)
}
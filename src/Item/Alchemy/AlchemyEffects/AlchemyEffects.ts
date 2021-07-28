import {ItemId} from "../../../Util/Identifiers/ItemID";

export type AlchemyEffects = Partial<AlchemyEffect>[]

export interface AlchemyResult {
    itemId: ItemId,
    dc: number
}

export interface AlchemyEffect {
    id: string
    label: string,
    icon: string
    results: Partial<AlchemyResult>[]
}
export const DefaultAlchemyEffect: AlchemyEffect = {
    id: "",
    label: "",
    icon: "",
    results: []
}
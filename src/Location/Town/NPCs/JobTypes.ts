import {SpellSeller} from "../SpellSeller/SpellSeller";
import SpellSellerComponent from "../SpellSeller/SpellSellerComponent"

interface JobTypeData {
    name: string,
    component: any,
    clazz: any
}

export enum JobType {
    Mage = "SpellSeller"
}

export const JobTypeDataMap: {[type in JobType]: JobTypeData} = {
    [JobType.Mage]: {
        name: "Spell Seller",
        component: SpellSellerComponent,
        clazz: SpellSeller
    }
}
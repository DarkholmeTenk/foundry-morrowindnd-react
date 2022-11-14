import {AlchemyEffects} from "./AlchemyEffects/AlchemyEffects";

export const defaultAlchemySettings: AlchemySettings = {
    effects: []
}

export interface AlchemySettings {
    effects: AlchemyEffects
}
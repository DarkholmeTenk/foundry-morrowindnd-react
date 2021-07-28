import {AlchemyEffects} from "./AlchemyEffects/AlchemyEffects";
import {RegularSettings} from "../../Settings/Settings";

export const defaultAlchemySettings: AlchemySettings = {
    effects: []
}

export interface AlchemySettings {
    effects: AlchemyEffects
}
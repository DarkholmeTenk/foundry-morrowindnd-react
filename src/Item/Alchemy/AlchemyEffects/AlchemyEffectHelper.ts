import {AlchemyEffect, DefaultAlchemyEffect} from "./AlchemyEffects";
import {RegularSettings} from "../../../Settings/Settings";

export function getAlchemyEffect(id: string): AlchemyEffect | undefined {
    let effects = RegularSettings.value?.alchemy?.effects || []
    let effect = effects.find(x=>x?.id === id)
    if(effect) {
        return {...DefaultAlchemyEffect, ...effect}
    }
}
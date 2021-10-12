import {setupSettingMenu} from "../Constants/Config";
import {AlchemySettings, defaultAlchemySettings} from "../Item/Alchemy/AlchemySettings";
import SettingsMenu from "./SettingsMenu";
import {PackSelectorOptions} from "../Constants/Packs/PackSelectorComponent";

export interface RegularSetting {
    alchemy: Partial<AlchemySettings>
}

const defaultSetting: RegularSetting = {
    alchemy: defaultAlchemySettings
}

export const RegularSettings =  setupSettingMenu<Partial<RegularSetting>>({
    key: "Regular",
    label: "General Settings",
    default: defaultSetting,
    sheetOptions: {width: 600, height: 800},
    name: "Regular Settings",
    restricted: true,
    type: SettingsMenu,
    scope: "world"
})
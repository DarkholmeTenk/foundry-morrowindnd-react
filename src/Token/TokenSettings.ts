import TokenSettingComponent from "./TokenSettingComponent";
import {setupSettingMenu} from "../Settings/SettingMenu";

export interface TokenSetting {
    lootTokenBase?: UUID,
    sellLootDump?: UUID
}

export const TokenSettings = setupSettingMenu<TokenSetting>({
    label: "Token Settings",
    name: "Token Settings",
    key: "tokenSettings",
    type: TokenSettingComponent,
    sheetOptions: {width: 600, height: 800},
    restricted: true,
    default: {},
    scope: "world"
})
import {ActorId} from "../Util/Identifiers/ActorID";
import {setupSettingMenu} from "../Constants/Config";
import TokenSettingComponent from "./TokenSettingComponent";

export interface TokenSetting {
    lootTokenBase?: ActorId,
    sellLootDump?: ActorId
}

export const TokenSettings = setupSettingMenu<TokenSetting>({
    label: "Token Settings",
    name: "Token Settings",
    key: "tokens",
    type: TokenSettingComponent,
    sheetOptions: {width: 600, height: 800},
    restricted: true,
    default: {},
    scope: "world"
})
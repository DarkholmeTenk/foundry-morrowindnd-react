import TokenSettingComponent from "./TokenSettingComponent";
import {setupSettingMenu} from "@/Settings/SettingMenu";
import {loadActor} from "Util/Identifiers/UuidHelper";

export interface TokenSetting {
    lootTokenBase?: UUID,
    sellLootDump?: UUID,
    partyCharacters?: UUID[]
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

export function getPartyCargoHolder(): Actor5e | undefined {
    let uuid = TokenSettings.value.sellLootDump
    if(uuid) return loadActor.sync(uuid)
    return undefined
}

export function isPartyCargoHolder(actor: Actor5e): boolean {
    return TokenSettings.value.sellLootDump === actor.uuid
}

export function getPartyUUIDs(): UUID[] {
    return TokenSettings.value.partyCharacters ?? []
}
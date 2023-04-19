import {setupSetting} from "Settings/Config";

export const GoldDisplayUsePPSetting = setupSetting({
    scope: "client",
    default: true,
    key: "golddisplay.pp",
    name: "Show PP",
    type: Boolean
})

export const GoldDisplayShowBreakdownSetting = setupSetting({
    scope: "client",
    default: true,
    key: "golddisplay.breakdown",
    name: "Show Currency Breakdown",
    type: Boolean
})

export const GoldDisplayUseColoursSetting = setupSetting({
    scope: "client",
    default: true,
    key: "golddisplay.colour",
    name: "Show Currency Colours",
    type: Boolean
})
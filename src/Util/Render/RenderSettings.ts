import {setupSetting} from "../../Constants/Config";

export const RenderHackEnabled = setupSetting<Boolean>({
    key: "RenderHack.Enabled",
    name: "Enable Render Hack",
    default: true,
    type: Boolean,
    scope: 'client'
})

export const RenderHackMillis = setupSetting<Number>({
    key: "RenderHack.Millis",
    name: "Render Hack millis to render after change",
    default: 2500,
    type: Number,
    scope: 'client'
})
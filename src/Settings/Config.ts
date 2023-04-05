//@ts-ignore
import {SimpleReactFormSheet} from "Util/React/ReactFormApplication"
import {migrateSettings} from "./SettingsMigrator";
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";

export const SettingsModuleKey = FLAG_SCOPE
let isInitialised = false

const settings: BaseSetting<any, any>[] = []

export function addSetting<Z extends BaseSetting<any, any>>(x: Z): Z {
    settings.push(x)
    if(isInitialised) x.register()
    return x
}

export interface RealSettingData<X> extends BaseSettingData<X>{
    scope: Scope,
    config: boolean
}
export type Scope = "world" | "client" | undefined
export interface BaseSettingData<X> {
    key: string,
    name: string,
    hint?: string
    default: X,
    scope?: Scope,
    type: any
}
export class BaseSetting<Y extends RealSettingData<X>, X> {
    constructor(public readonly data: Y) {}

    get value(): X {
        return isInitialised ? game.settings!.get(SettingsModuleKey, this.data.key) as X : this.data.default
    }

    set value(newValue) {
        game.settings.set(SettingsModuleKey, this.data.key, newValue)
    }

    register() {}
}

export interface MySettingData<X> extends BaseSettingData<X> {
    config?: boolean
}
export class Setting<X> extends BaseSetting<RealSettingData<X>, X> {
    constructor(data: MySettingData<X>) {
        super({...data, scope: data.scope ?? "world", config: data.config ?? true})
    }

    register() {
        game.settings.register(SettingsModuleKey, this.data.key, {
            ...this.data
        } as any)
    }
}
export function setupSetting<X extends object>(data: MySettingData<X>): Setting<X> {
    return addSetting(new Setting<X>(data))
}

function init() {
    if(isInitialised) return
    settings.forEach(x=>x.register())
    isInitialised = true
}

Hooks.on("init", init)
Hooks.on("ready", init)
Hooks.on("ready", migrateSettings)
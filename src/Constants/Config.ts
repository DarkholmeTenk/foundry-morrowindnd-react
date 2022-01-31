//@ts-ignore
import {SimpleReactFormSheet} from "../Util/React/ReactFormApplication"
import * as React from "react";

const MODULE = "morrowindnd"
let isInitialised = false

const settings: BaseSetting<any, any>[] = [

]
function addSetting<Z extends BaseSetting<any, any>>(x: Z): Z {
    settings.push(x)
    if(isInitialised) x.register()
    return x
}

interface RealSettingData<X> extends BaseSettingData<X>{
    scope: string,
    config: boolean
}
interface BaseSettingData<X> {
    key: string,
    name: string,
    hint?: string
    default: X,
    scope?: string,
    type: any
}
class BaseSetting<Y extends RealSettingData<X>, X> {
    constructor(public readonly data: Y) {}

    get value(): X {
        return isInitialised ? game.settings!.get(MODULE, this.data.key) as X : this.data.default
    }

    set value(newValue) {
        game.settings.set(MODULE, this.data.key, newValue)
    }

    register() {}
}

interface SettingData<X> extends BaseSettingData<X> {
    config?: boolean
}
export class Setting<X> extends BaseSetting<RealSettingData<X>, X> {
    constructor(data: SettingData<X>) {
        super({...data, scope: data.scope ?? "world", config: data.config ?? true})
    }

    register() {
        game.settings.register(MODULE, this.data.key, {
            ...this.data
        })
    }
}
export function setupSetting<X extends object>(data: SettingData<X>): Setting<X> {
    return addSetting(new Setting<X>(data))
}
interface RealSettingMenuData<X> extends RealSettingData<X>, SettingMenuData<X> {}
interface SettingMenuData<X> extends BaseSettingData<X>{
    label: string,
    icon?: string,
    sheetOptions?: any,
    restricted: boolean,
    scope: string
}
export class SettingMenu<X extends object> extends BaseSetting<RealSettingMenuData<X>, X> {
    constructor(private readonly setting: Setting<X>, data: SettingMenuData<X>) {
        super({...data, scope: data.scope ?? "world", config: true});
    }

    get value() { return this.setting.value }
    set value(newValue) { this.setting.value = newValue}

    register() {
        let type = this.data.type
        let self = this
        class TempClass extends SimpleReactFormSheet {
            constructor(...args) {
                super(React.createElement(type, {setting: self.setting}), ...args)
            }

            static get defaultOptions() {
                return mergeObject(super['defaultOptions'], {
                    ...self.data.sheetOptions || {}
                })
            }
        }

        game.settings.registerMenu(MODULE, this.data.key, {
            ...this.data,
            type: TempClass
        })
    }
}
export function setupSettingMenu<X extends object>(data: SettingMenuData<X>): SettingMenu<X> {
    let settingData: SettingData<X> = {
        ...data,
        key: data.key + '.value',
        config: false,
        type: null
    }
    let setting = setupSetting(settingData)
    return addSetting(new SettingMenu(setting, data))
}

function init() {
    if(isInitialised) return
    settings.forEach(x=>x.register())
    isInitialised = true
}

Hooks.on("init", init)
Hooks.on("ready", init)
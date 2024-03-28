import {SimpleReactFormSheet} from "Util/React/ReactFormApplication";
import * as React from "react";
import {
    addSetting,
    BaseSetting,
    BaseSettingData, SettingsModuleKey,
    MySettingData,
    RealSettingData,
    Scope,
    SettingObject,
    setupSetting
} from "./Config";

interface RealSettingMenuData<X> extends Omit<RealSettingData<X>, "type">, SettingMenuData<X> {
}

export interface SettingProp<T> {
    setting: SettingObject<T>
}

interface SettingMenuData<X> extends BaseSettingData<X> {
    label: string,
    icon?: string,
    sheetOptions?: any,
    restricted: boolean,
    scope: Scope,
    type: (props: SettingProp<X>)=>JSX.Element
}

export class SettingMenu<X extends object> extends BaseSetting<RealSettingMenuData<X>, X> {
    constructor(private readonly setting: SettingObject<X>, data: SettingMenuData<X>) {
        super({...data, scope: data.scope ?? "world", config: true});
    }

    get value() {
        return this.setting.value
    }

    set value(newValue) {
        this.setting.value = newValue
    }

    register() {
        let Type = this.data.type
        let self = this

        class TempClass<T> extends SimpleReactFormSheet<T> {
            constructor() {
                super(<Type setting={self.setting} />)
            }

            static get defaultOptions() {
                return mergeObject(super['defaultOptions'], {
                    ...(self.data.sheetOptions || {})
                });
            }
        }

        this.version = 1
        game.settings.registerMenu(SettingsModuleKey, this.data.key, {
            ...this.data,
            type: TempClass,
            onChange: ()=>{
                this.version++
            }
        })
    }
}

export function setupSettingMenu<X extends object>(data: SettingMenuData<X>): SettingMenu<X> {
    let settingData: MySettingData<X> = {
        ...data,
        key: data.key + '.value',
        config: false,
        type: null
    }
    let setting = setupSetting(settingData)
    return addSetting(new SettingMenu(setting, data))
}
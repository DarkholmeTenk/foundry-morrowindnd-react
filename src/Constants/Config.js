//@ts-ignore
import { SimpleReactFormSheet } from "../Util/Helper/ReactFormApplication";
import * as React from "react";
const MODULE = "morrowindnd";
let isInitialised = false;
const settings = [];
function addSetting(x) {
    settings.push(x);
    if (isInitialised)
        x.register();
    return x;
}
class BaseSetting {
    constructor(data) {
        this.data = data;
    }
    get value() {
        return isInitialised ? game.settings.get(MODULE, this.data.key) : this.data.default;
    }
    set value(newValue) {
        game.settings.set(MODULE, this.data.key, newValue);
    }
    register() { }
}
export class Setting extends BaseSetting {
    constructor(data) {
        super(data);
        this.data = data;
        if (!data.scope)
            data.scope = "world";
        if (data.config === undefined || data.config === null)
            data.config = true;
    }
    register() {
        game.settings.register(MODULE, this.data.key, {
            ...this.data
        });
    }
}
export function setupSetting(data) {
    return addSetting(new Setting(data));
}
export class SettingMenu extends BaseSetting {
    constructor(setting, data) {
        super(data);
        this.setting = setting;
    }
    get value() { return this.setting.value; }
    set value(newValue) { this.setting.value = newValue; }
    register() {
        let type = this.data.type;
        let self = this;
        class TempClass extends SimpleReactFormSheet {
            constructor(...args) {
                super(React.createElement(type, { setting: self.setting }), ...args);
            }
            static get defaultOptions() {
                return mergeObject(super.defaultOptions, {
                    ...self.data.sheetOptions || {}
                });
            }
        }
        game.settings.registerMenu(MODULE, this.data.key, {
            ...this.data,
            type: TempClass
        });
    }
}
export function setupSettingMenu(data) {
    let settingData = {
        ...data,
        key: data.key + '.value',
        config: false,
        type: null
    };
    let setting = setupSetting(settingData);
    return addSetting(new SettingMenu(setting, data));
}
Hooks.on("init", () => {
    settings.forEach(x => x.register());
    isInitialised = true;
});

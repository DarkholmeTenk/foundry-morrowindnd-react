import {BaseSetting} from "Settings/Config";

class SettingDerived<T, U> {
    private lastVersion = -1
    private u: U
    constructor(private readonly setting: BaseSetting<any, T>, private readonly map: (t: T)=>U) {
        this.update()
    }

    private update() {
        this.lastVersion = this.setting.version
        this.u = this.map(this.setting.value)
    }

    get value(): U {
        if(this.setting.version !== this.lastVersion) this.update()
        return this.u
    }
}

export function deriveFromSetting<T, U>(setting: BaseSetting<any, T>, map: (t: T)=>U) {
    return new SettingDerived(setting, map)
}
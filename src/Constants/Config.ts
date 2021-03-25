interface SettingData<X> {
    key: string,
    name: string,
    hint?: string,
    scope?: string,
    config?: boolean
    default: X,
    type: any
}

const MODULE = "morrowindnd"
let isInitialised = false

const settings: Setting<any>[] = [

]

export class Setting<X> {
    constructor(public data: SettingData<X>) {
        if(!data.scope) data.scope = "world"
        if(data.config === undefined || data.config === null) data.config = true
    }

    register() {
        game.settings.register(MODULE, this.data.key, {
            ...this.data
        })
    }

    get value(): X {
        return isInitialised ? game.settings.get(MODULE, this.data.key) : this.data.default
    }

    set value(newValue) {
        game.settings.set(MODULE, this.data.key, newValue)
    }
}
Hooks.on("init", ()=>{
    settings.forEach(x=>x.register())
    isInitialised = true
})

export function setupSetting<X>(data: SettingData<X>): Setting<X> {
    let setting = new Setting<X>(data)
    settings.push(setting)
    if(isInitialised) setting.register()
    return setting
}
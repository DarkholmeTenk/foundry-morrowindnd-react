import {BasicSatchelItemDefinition} from "Systems/Satchels/Base/BasicSatchelItem";
import {SettingObject} from "Settings/Config";
import {deriveFromSetting} from "Settings/SettingDerived";

export interface SatchelDefinition {
    baseWeight: number
    baseValue: number,
    image: string,
    name: string
}

export abstract class BasicSatchelRegistry<T extends BasicSatchelItemDefinition> {
    constructor(
        readonly flagId: string,
    ) {
    }

    get satchelDefinition(): SatchelDefinition {
        return this.getSatchelDefinition()
    }

    abstract getSatchelDefinition(): SatchelDefinition

    get(id: string): T | undefined {
        return undefined
    }
}

export interface BasicSatchelRegistrySettingData<T extends BasicSatchelItemDefinition> {
    satchelDefinition: SatchelDefinition,
    items: T[]
}
export class SettingSatchelRegistry<T extends BasicSatchelItemDefinition> extends BasicSatchelRegistry<T> {
    map: {value: Record<string, T>}

    constructor(private readonly setting: SettingObject<BasicSatchelRegistrySettingData<T>>) {
        super(setting.data.key);
        this.map = deriveFromSetting(setting, (t)=>{
            let r: Record<string, T> = {}
            t.items.forEach((x)=>{
                r[x.id] = x
            })
            return r
        })
    }

    get itemMap(): Record<string, T> {
        return this.map.value
    }

    get data() {
        return this.setting.value
    }

    get(id: string): T | undefined {
        return this.itemMap[id]
    }

    getSatchelDefinition(): SatchelDefinition {
        return this.data.satchelDefinition;
    }
}
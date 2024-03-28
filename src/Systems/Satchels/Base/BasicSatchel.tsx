import {BasicSatchelRegistry} from "Systems/Satchels/Base/BasicSatchelRegistry";
import {BasicSatchelItemDefinition, SatchelItem} from "Systems/Satchels/Base/BasicSatchelItem";
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";

interface SatchelFlag {
    contents: Record<string, number>
}
export const DefaultSatchelFlag: SatchelFlag = {contents: {}}

export interface SatchelItemQty {
    id: string
    qty: number
}
export abstract class BasicSatchel<T extends BasicSatchelItemDefinition> {
    flagKey: string
    constructor(
        readonly item: Item5e,
        readonly registry: BasicSatchelRegistry<T>
    ) {
        this.flagKey = "satchel_" + this.registry.flagId
    }

    get hasFlag(): boolean {
        return this.item.getFlag(FLAG_SCOPE, this.flagKey) !== undefined
    }

    get flag(): SatchelFlag {
        return this.item.getFlag(FLAG_SCOPE, this.flagKey) ?? DefaultSatchelFlag
    }

    async setFlag(flag: SatchelFlag) {
        await this.item.setFlag(FLAG_SCOPE, this.flagKey, flag)
    }

    async add(items: SatchelItemQty[]) {
        if(items.length === 0 ) return
        let {contents} = this.flag
        let newContents = {...contents}
        items.forEach(({id, qty})=>{
            newContents[id] = (newContents[id] ?? 0) + qty
        })
        await this.setFlag({contents: newContents})
        await this.fixValues()
    }

    async remove(items: SatchelItemQty[]) {
        if(items.length === 0 ) return
        let {contents} = this.flag
        let newContents = {...contents}
        items.forEach(({id, qty})=>{
            let newQty = (newContents[id] ?? 0) + qty
            if(newQty > 0)
                newContents[id] = newQty
            else
                delete newContents[id]
        })
        await this.setFlag({contents: newContents})
        await this.fixValues()
    }

    listItems(): SatchelItem<T>[] {
        let {contents} = this.flag
        return Object.keys(contents).map((itemId) => {
            let base = this.registry.get(itemId)
            if (!base) return undefined
            return {
                definition: base,
                count: contents[itemId]
            }
        }).filter(x => x) as SatchelItem<T>[]
    }

    private async fixValues() {
        let items = this.listItems()
        let {baseWeight, baseValue} = this.registry.satchelDefinition
        let weight = items.reduce((p,c)=>p + c.count * c.definition.weight, baseWeight)
        let value = items.reduce((p,c)=>p + c.count * c.definition.value, baseValue)
        await this.item.update({
            "system.weight": weight,
            "system.price.value": value
        })
    }
}
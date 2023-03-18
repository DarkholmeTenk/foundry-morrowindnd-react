import EnchantConfig, {SoulSize} from "../EnchantConfig";
import {getProperties, ITEM_FLAG} from "../../ItemProperties";
import {addItem} from "../../../Util/Helper/ItemTransferHelper";
import {itemQty} from "../../../Util/Extension/Items";

interface SoulInfo {
    size: SoulSize,
    fillSize?: SoulSize
}

export function isSoulGem(item: Item): SoulInfo | undefined {
    let [data] = getProperties(item)
    if(data?.soulGem?.isSoulGem) {
        let {soulGem} = data
        let size = EnchantConfig.SoulSizes.find(x=>x.label === soulGem.size)
        let fillSize = EnchantConfig.SoulSizes.find(x=>x.label === soulGem.fillSize)
        if(size) {
            return {size, fillSize}
        }
    }
}

async function fillSoulGem(item: Item, size: SoulSize) {
    let [data, setData] = getProperties(item)
    if(data?.soulGem?.isSoulGem) {
        let {soulGem} = data
        let newSoulGem = {...soulGem, fillSize: size.label}
        await setData({...data, soulGem: newSoulGem})
    }
}

export function getSoulGems(actor: Actor, filter?: (soulInfo: SoulInfo)=>boolean): Item[] {
    return actor.items.filter(item=>{
        let soulInfo = isSoulGem(item)
        if(soulInfo) {
            if(filter) {
                return filter(soulInfo)
            } else {
                return true
            }
        }
        return false
    })
}

export async function fillActorSoulGem(actor: Actor, deadActor: Actor) {
    let soulSize = getSoulLevel(deadActor)
    if(soulSize) {
        let gem = getSoulGems(actor, info => !info.fillSize && info.size.size >= soulSize!.size).find(() => true)

        if (gem) {
            let qty = itemQty(gem) || 1
            if (qty > 1) {
                await gem.update({"data.quantity": qty - 1})
            } else {
                await gem.delete()
            }
            let source = gem._source
            let newGemData: any = {
                ...source,
                name: `Filled ${gem.name} - (${soulSize.label} - ${deadActor.name})`,
                system: {
                    ...source.system,
                    quantity: 1
                }
            }
            newGemData.flags["MorrowinDnDReact"][ITEM_FLAG].soulGem.fillSize = soulSize.label
            await addItem(actor.uuid, newGemData)
        }
    }
}

export function getSoulLevel(actor: Actor) {
    let data = actor.system as any
    let cr = data.details?.cr || 0
    let type = data.details?.type || ""
    if(type.toLowerCase().includes("humanoid")) {
        return null
    } else {
        if(cr <= 2) return EnchantConfig.SoulSizes[0]
        if(cr <= 4) return EnchantConfig.SoulSizes[1]
        if(cr <= 8) return EnchantConfig.SoulSizes[2]
        if(cr <= 16) return EnchantConfig.SoulSizes[3]
        return EnchantConfig.SoulSizes[4]
    }
}
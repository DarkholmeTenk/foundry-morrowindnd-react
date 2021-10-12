import EnchantConfig, {SoulSize} from "../EnchantConfig";
import {getProperties, ITEM_FLAG} from "../../ItemProperties";

interface SoulInfo {
    size: SoulSize,
    fillSize?: SoulSize
}

export function isSoulGem(item: Item5e): SoulInfo | undefined {
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

async function fillSoulGem(item: Item5e, size: SoulSize) {
    let [data, setData] = getProperties(item)
    if(data?.soulGem?.isSoulGem) {
        let {soulGem} = data
        let newSoulGem = {...soulGem, fillSize: size.label}
        await setData({...data, soulGem: newSoulGem})
    }
}

export function getSoulGems(actor: Actor5e, filter?: (soulInfo: SoulInfo)=>boolean): Item[] {
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

export async function fillActorSoulGem(actor: Actor5e, deadActor: Actor5e) {
    let soulSize = getSoulLevel(deadActor)
    if(soulSize) {
        let gem = getSoulGems(actor, info => !info.fillSize && info.size.size >= soulSize!.size).find(() => true)

        if (gem) {
            let qty = (gem.data.data as any).quantity || 1
            if (qty > 1) {
                await gem.update({"data.quantity": qty - 1})
            } else {
                await gem.delete()
            }
            let newGemData: any = {
                ...gem.data,
                name: `Filled ${gem.name} - (${soulSize.label} - ${deadActor.name})`,
                data: {
                    ...gem.data.data,
                    quantity: 1
                }
            }
            newGemData.flags.morrowindnd[ITEM_FLAG].soulGem.fillSize = soulSize.label
            await Item.create(newGemData, {parent: actor})
        }
    }
}

export function getSoulLevel(actor: Actor) {
    let data = actor.data.data as any
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
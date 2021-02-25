import EnchantConfig from "../EnchantConfig";
import { getProperties, ITEM_FLAG } from "../../Item/ItemProperties";
export function isSoulGem(item) {
    let [data] = getProperties(item);
    if (data?.soulGem?.isSoulGem) {
        let { soulGem } = data;
        let size = EnchantConfig.SoulSizes.find(x => x.label === soulGem.size);
        let fillSize = EnchantConfig.SoulSizes.find(x => x.label === soulGem.fillSize);
        if (size) {
            return { size, fillSize };
        }
    }
}
async function fillSoulGem(item, size) {
    let [data, setData] = getProperties(item);
    if (data?.soulGem?.isSoulGem) {
        let { soulGem } = data;
        let newSoulGem = { ...soulGem, fillSize: size.label };
        await setData({ ...data, soulGem: newSoulGem });
    }
}
export async function fillActorSoulGem(actor, deadActor) {
    let soulSize = getSoulLevel(deadActor);
    let gem = actor.items.find(item => {
        let soulInfo = isSoulGem(item);
        if (soulInfo && !soulInfo.fillSize) {
            return soulInfo.size.size >= soulSize.size;
        }
        return false;
    });
    if (gem) {
        let qty = gem.data.data.quantity || 1;
        if (qty > 1) {
            await gem.update({ "data.quantity": qty - 1 });
        }
        else {
            await actor.deleteOwnedItem(gem.id);
        }
        let newGemData = {
            ...gem.data,
            name: `Filled ${gem.name} - (${soulSize.label} - ${deadActor.name})`,
            data: {
                ...gem.data.data,
                quantity: 1
            }
        };
        newGemData.flags.morrowindnd[ITEM_FLAG].soulGem.fillSize = soulSize.label;
        await actor.createOwnedItem(newGemData);
    }
}
export function getSoulLevel(actor) {
    let data = actor.data.data;
    let cr = data.details?.cr || 0;
    let type = data.details?.type || "";
    if (type.toLowerCase().includes("humanoid")) {
        return null;
    }
    else {
        if (cr <= 2)
            return EnchantConfig.SoulSizes[0];
        if (cr <= 4)
            return EnchantConfig.SoulSizes[1];
        if (cr <= 8)
            return EnchantConfig.SoulSizes[2];
        if (cr <= 16)
            return EnchantConfig.SoulSizes[3];
        return EnchantConfig.SoulSizes[4];
    }
}

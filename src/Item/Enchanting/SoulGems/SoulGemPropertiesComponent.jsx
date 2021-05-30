import EnchantConfig from "../EnchantConfig";
import Selector from "../../../Util/Components/Selector";

export default function SoulGemPropertiesComponent({soulGemState, setSoulGemState}) {
    let SoulSizes = EnchantConfig.instance.SoulSizes

    let isSoulGem = soulGemState?.isSoulGem || false
    let size = soulGemState?.size || "Petty"
    let sizeObj = SoulSizes.find(x=>x.label === size)
    let fillSize = soulGemState?.fillSize || null
    let fillSizeObj = SoulSizes.find(x=>x.label === fillSize)
    return <div>
        Is Soul Gem: <input type="checkbox" checked={isSoulGem} onChange={(e)=>setSoulGemState({size, isSoulGem: e.target.checked})} />
        Size: <Selector values={SoulSizes} value={sizeObj} setValue={(v)=>setSoulGemState({...soulGemState, size: v.label})} labelFunction={v=>v.label} />
        Filled: <Selector values={SoulSizes} value={fillSizeObj} setValue={(v)=>setSoulGemState({...soulGemState, fillSize: v?.label})} labelFunction={v=>v?.label || ""} includeNull />
    </div>
}
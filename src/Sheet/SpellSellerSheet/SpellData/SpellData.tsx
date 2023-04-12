import {SpellPurchasePriceModifier} from "Sheet/SpellSellerSheet/SpellCostCalculator";
import {getRemoteSpellData, RemoteSpellData} from "Sheet/SpellSellerSheet/SpellData/RemoteSpellSourceData";
import {SpellSchools} from "Util/Components/NewItemTable/ItemTypes";

function flatSource<T>(x: Record<string, Record<string, T>>): Record<string, T> {
    let r: Record<string,T> = {}
    Object.keys(x).forEach(y=>Object.assign(r, x[y]))
    return r
}

function matchSchool(subclassName: string, spell: ItemSpell): boolean {
    let schoolName = SpellSchools[spell.system.school]?.name
    if(!schoolName) return false
    return subclassName.split(" ").some(subPart=>{
        return schoolName?.toLowerCase() === subPart.toLowerCase()
    })
}

function matchSubclass(actor: Actor5e, spell: ItemSpell, data: RemoteSpellData) {
    let classes = Object.keys(actor.classes)
    if(!data.subclass) return false
    let flatClasses = flatSource(data.subclass)
    return classes.some((clzName)=>{
        let sub = actor.classes[clzName].subclass
        if(!sub) return false
        if(matchSchool(sub.name, spell)) return true
        let y = flatClasses[clzName]
        if(!y) return false
        let flatSubs = flatSource(y)
        return Object.values(flatSubs).some(val=>{
            return val.name.toLowerCase() === sub?.name?.toLowerCase()
        })
    })
}

function matchClass(actor: Actor5e, data: RemoteSpellData) {
    if(!data.class) return false
    let classes = Object.keys(actor.classes).map(x=>x.toLowerCase())
    let flatClasses = Object.keys(flatSource(data.class)).map(x=>x.toLowerCase())
    return classes.some(clz=>flatClasses.includes(clz))
}

export async function getDefaultPurchasePriceModifier(actor: Actor5e, spell: ItemSpell): Promise<SpellPurchasePriceModifier> {
    let data = await getRemoteSpellData()
    if(!data) return SpellPurchasePriceModifier.NONE
    let flatSpell = flatSource(data)[spell.name.toLowerCase()]
    if(!flatSpell) return SpellPurchasePriceModifier.NONE
    if(matchSubclass(actor, spell, flatSpell)) return SpellPurchasePriceModifier.SPEC
    if(matchClass(actor, flatSpell)) return SpellPurchasePriceModifier.NONE
    return SpellPurchasePriceModifier.CROSS_CLASS
}
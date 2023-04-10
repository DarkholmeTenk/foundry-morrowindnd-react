import React, {useMemo, useState} from "react"
import {SpellSellerPacks} from "./Settings";
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {loadPack} from "Util/Identifiers/PackHelper";
import {isSpell} from "Constants/SpellConstants";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {chainSort, mapSort, NumSorter, StringSorter} from "Util/Sorting";
import {SpellSellerTable} from "Sheet/SpellSellerSheet/Table/SpellSellerTable";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import {PurchaseModal} from "Sheet/SpellSellerSheet/PurchaseModal/PurchaseModal";

const Sorter = chainSort<ItemSpell>(
    mapSort(a=>a.system.level, NumSorter),
    mapSort(a=>a.name, StringSorter)
)

async function loadSpells(): Promise<ItemSpell[]> {
    let nameMap: Record<string, true> = {}
    let items = await loadPack(SpellSellerPacks.value, isSpell)
    return items.filter(i=>{
        if(nameMap[i.name]) return false
        nameMap[i.name] = true
        return true
    })
}

function hasSpell(self: Actor5e | undefined, spell: ItemSpell) {
    if(!self) return false
    if(self.items.getName(spell.name)) return true
    return false
}

export default function SpellSellerSheetComponent({merchant}: {merchant: Actor5e}) {
    let self = useNewSelf()
    useWatchEntity(merchant)
    let spells = useSuspensePromise("spells", loadSpells)
    let filteredSpells = useMemo(()=>{
        return spells.filter(x=>x.system.level > 0)
            .filter(x=>!hasSpell(self, x))
                .sort(Sorter)
    }, [spells, self])
    let [buying, setBuying] = useState<ItemSpell | undefined>()

    if(!self) return <div>Select yourself</div>

    return <div>
        {buying && <PurchaseModal merchant={merchant} self={self} spell={buying} close={()=>setBuying(undefined)} /> }
        <SpellSellerTable self={self} merchant={merchant} spells={filteredSpells} setBuying={setBuying} />
    </div>
}
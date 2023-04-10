import React, {useMemo} from "react"
import {SpellSellerPacks} from "./Settings";
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {loadPack} from "Util/Identifiers/PackHelper";
import {isSpell} from "Constants/SpellConstants";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {chainSort, mapSort, NumSorter, StringSorter} from "Util/Sorting";
import {SpellSellerTable} from "Sheet/SpellSellerSheet/Table/SpellSellerTable";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";

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

export default function SpellSellerSheetComponent({merchant}: {merchant: Actor5e}) {
    let self = useNewSelf()
    useWatchEntity(merchant)
    let spells = useSuspensePromise("spells", loadSpells)
    let filteredSpells = useMemo(()=>{
        return spells.filter(x=>x.system.level < 4 && x.system.level > 0)
                .sort(Sorter)
    }, [spells])

    if(!self) return <div>Select yourself</div>

    return <div>
        <SpellSellerTable self={self} merchant={merchant} spells={filteredSpells} />
    </div>
}

function SuspenseTest() {
    let value = useSuspensePromise("timer", ()=>new Promise<boolean>(r=>setTimeout(()=>r(true), 5000)))
    return <div>LOADED! {value}</div>
}
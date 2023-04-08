import {CircularProgress} from "@material-ui/core";
import React, {useMemo} from "react"
import {usePromise} from "Util/Helper/PromiseHelper";
import {SpellSellerPacks} from "./Settings";
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {loadPack} from "Util/Identifiers/PackHelper";
import {isSpell} from "Constants/SpellConstants";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {chainSort, mapSort, NumSorter, StringSorter} from "Util/Sorting";
import {SpellSellerTable} from "@/Sheet/SpellSellerSheet/Table/SpellSellerTable";

const Sorter = chainSort<ItemSpell>(
    mapSort(a=>a.system.level, NumSorter),
    mapSort(a=>a.name, StringSorter)
)

export default function SpellSellerSheetComponent({merchant}: {merchant: Actor5e}) {
    let self = useNewSelf()
    useWatchEntity(merchant)
    let {result: spells, loading} = usePromise(()=>loadPack(SpellSellerPacks.value, isSpell), [])
    let filteredSpells = useMemo(()=>{
        if(!spells) {
            return []
        } else {
            return spells.filter(x=>x.system.level < 4 && x.system.level > 0)
                .sort(Sorter)
        }
    }, [spells])

    if(!self) return <div>Select yourself</div>
    if(loading) return <CircularProgress />

    return <div>
        {spells && <SpellSellerTable self={self} merchant={merchant} spells={filteredSpells} /> }
    </div>
}
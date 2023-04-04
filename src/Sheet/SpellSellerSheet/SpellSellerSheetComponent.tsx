import {getMerchantFlag} from "./SpellSellertFlag";
import TokenPermission from "../../Util/Components/TokenPermission";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import SpellSellerFlagComponent from "./SpellSellerFlagComponent";
import {CircularProgress, Tooltip} from "@material-ui/core";
import React, {useMemo} from "react"
// @ts-ignore
import Styles from "./SpellSellerSheet.module.scss"
import {usePromise} from "../../Util/Helper/PromiseHelper";
import {SpellSellerPacks} from "./Settings";
import {getSpellClasses} from "../../Data/SpellData";
import {SpellSchools} from "../../Util/Components/NewItemTable/ItemTypes";
import {calculateSpellCost, getMatches, SpellMatches} from "./SpellCostCalculator";
import {SpellSellerBuy} from "./SpellSellerAction";
import LogFactory from "../../Util/Logging";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";
import {loadPack} from "../../Util/Identifiers/PackHelper";
import {isSpell} from "../../Constants/SpellConstants";
import {useWatchEntity} from "../../Util/Helper/EntityHelper";
import {DefaultItemColumns} from "../../Util/Components/NewItemTable/Item/ItemColumns";
import {getterColumn} from "../../Util/Components/NewItemTable/Util/GetterColumn";
import {NewItemTable} from "../../Util/Components/NewItemTable/NewItemTable";
import {ItemExpander} from "../../Util/Components/NewItemTable/Item/ItemExpander";
import {ItemControl} from "../../Util/Components/NewItemTable/Item/ItemControls";

const log = LogFactory("SpellSellerSheetComponent")

function SpellMatch({match: {matchClass, matchSubClass, matchSchool}}: {match: SpellMatches}) {
    let icon = `far fa-star`
    let text = "Non-class spell"
    if(matchClass) {
        if(matchSubClass || matchSchool) {
            icon = "fas fa-star"
            text = "Specialised Spell"
        } else {
            icon = "fas fa-star-half-alt"
            text = "Class Spell"
        }
    }
    return <Tooltip title={text}><i className={icon} /></Tooltip>
}

function SpellClassComponent({self, merchant, spell, goldAmount}: {self: Actor, merchant: Actor, spell: ItemSpell, goldAmount: number}) {
    let {result, loading} = usePromise(()=>getSpellClasses(spell), [spell])
    let cost = useMemo(()=>result ? calculateSpellCost(self, spell, result) : 0, [result, self, spell])
    if(self && !loading && result) {
        let matches = getMatches(self, spell, result)
        return <div>
            <SpellMatch match={matches} />
            <GoldDisplay value={cost ?? 0} />
        </div>
    } else {
        return <CircularProgress />
    }
}

function hasSpell(actor: Actor | null, spell: Item): Boolean {
    if(!actor) {
        return true
    } else {
        return actor.items.find(x=>x.name === spell.name && x.type === spell.type) == null
    }
}

function SpellIcon({item}: {item: ItemSpell}) {
    let school = SpellSchools[item.system.school]
    if(school) {
        return <Tooltip title={school.name}><i className={school.icon} /></Tooltip>
    } else {
        return <div>{item.system.school}</div>
    }
}

const LevelColumn = getterColumn<ItemSpell>("Level", (item)=>item.system.level ?? "-")
const Columns = [
    ...DefaultItemColumns,
    {
        label: "Spell Type",
        ColumnComponent: SpellIcon
    },
    LevelColumn,
    {
        label: "",
        ColumnComponent: SpellActionsColumn
    }
]

interface SpellActionsColumnArgs {
    item: ItemSpell,
    self: Actor5e,
    merchant: Actor5e
}
function SpellActionsColumn({item, self, merchant, myGoldAmount}) {
    let buy = ()=>SpellSellerBuy({merchant: merchant.uuid, self: self.uuid, spell: item.uuid})
    return <ItemControl title="Buy Spell" icon="fas fa-dollar-sign" onClick={buy} />
}

export default function SpellSellerSheetComponent({merchant}: {merchant: Actor5e}) {
    let self = useNewSelf()
    useWatchEntity(merchant)
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = self ? getGoldAmountFromActor(self) : 0
    let {result: spells, loading} = usePromise(()=>loadPack(SpellSellerPacks.value, isSpell), [])
    let filteredSpells = useMemo(()=>{
        if(!spells || !self) {
            return []
        } else {
            let me = self
            return spells.filter(x=>x.system.level < 4 && x.system.level > 0)
                .filter(x=>hasSpell(me, x))
        }
    }, [spells, self])

    self = self!
    return <div>
        {merchant.isOwner ? <div className="flexrow">
            <SpellSellerFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag} />
            <TokenPermission token={merchant} />
        </div> : null }
        {spells && <NewItemTable extraData={{self, merchant, myGoldAmount}} expander={ItemExpander} columns={Columns} items={filteredSpells} /> }
    </div>
}
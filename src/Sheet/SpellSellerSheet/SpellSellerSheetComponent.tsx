import {useNPC} from "../../Util/Helper/EntityHelper";
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
import {loadPacks} from "../../Util/Identifiers/PackId";
import ItemTable from "../../Util/Components/ItemTable/ItemTable";
import {ItemColumnImage, ItemColumnName} from "../../Util/Components/ItemTable/ItemTableDefaults";
import {getSpellClasses} from "../../Data/SpellData";
import {SpellSchools} from "../../Util/Components/ItemTable/ItemTypes";
import {calculateSpellCost, getMatches, SpellMatches} from "./SpellCostCalculator";
import {Control, generateControlsColumn} from "../../Util/Components/ItemTable/ItemTableControl";
import {SpellSellerBuy} from "./SpellSellerAction";
import {getActorId} from "../../Util/Identifiers/ActorID";
import {getItemId} from "../../Util/Identifiers/ItemID";
import LogFactory from "../../Util/Logging";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";

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

function SpellClassComponent({self, merchant, spell, goldAmount}: {self: Actor, merchant: Actor, spell: Item, goldAmount: number}) {
    let {result, loading} = usePromise(()=>getSpellClasses(spell), [spell])
    let cost = useMemo(()=>result ? calculateSpellCost(self, spell, result) : 0, [result, self, spell])
    if(self && !loading && result) {
        let matches = getMatches(self, spell, result)
        return <div>
            <SpellMatch match={matches} />
            <GoldDisplay value={cost} />
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

function SpellIcon({spell}: {spell: Item}) {
    let school = SpellSchools[spell.spell().school]
    if(school) {
        return <Tooltip title={school.name}><i className={school.icon} /></Tooltip>
    } else {
        return <div>{spell.spell().school}</div>
    }
}

async function getControlColumn(spell, self, merchant, goldAmount): Promise<Control[]> {
    let spellData = await getSpellClasses(spell)
    let cost = await calculateSpellCost(self, spell, spellData!)
    if(cost && cost < goldAmount) {
        return [
            {
                title: "Buy Spell",
                text: <i className='fas fa-dollar-sign'/>,
                onClick: ()=>SpellSellerBuy({merchant: getActorId(merchant), self: getActorId(self), spell: getItemId(spell)}),
            }
        ]
    } else {
        return []
    }
}

export default function SpellSellerSheetComponent({self: selfInput, merchant: merchantInput}) {
    let self = useNewSelf()
    let {value: merchant} = useNPC(merchantInput)
    merchant = merchant!
    let [merchantFlag, setMerchantFlag] = getMerchantFlag(merchant)
    let myGoldAmount = self ? getGoldAmountFromActor(self.data) : 0
    let {result: spells, loading} = usePromise(()=>loadPacks<Item>(SpellSellerPacks.value), [])
    let filteredSpells = useMemo(()=>{
        if(!spells) {
            return []
        } else {
            return spells.filter(x=>x.spell().level < 4 && x.spell().level > 0)
                .filter(x=>hasSpell(self, x))
        }
    }, [spells, self])

    self = self!
    return <div>
        {merchant.isOwner ? <div className="flexrow">
            <SpellSellerFlagComponent merchantFlag={merchantFlag} setMerchantFlag={setMerchantFlag} />
            <TokenPermission token={merchant} />
        </div> : null }
        {spells ? <ItemTable items={filteredSpells} columns={[
            ItemColumnImage,
            ItemColumnName,
            {
                title: "Spell Type",
                getter: ({item})=><SpellIcon spell={item} />
            },
            {
                title: "Level",
                getter: ({item})=>item.spell().level
            },
            {
                title: "Classes",
                getter: (({item})=><SpellClassComponent merchant={merchant!} self={self!} spell={item} goldAmount={myGoldAmount}/>)
            },
            generateControlsColumn(({item})=>getControlColumn(item, self, merchant, myGoldAmount), [self, merchant, myGoldAmount])
        ]} extraProps={{self, myGoldAmount}}/> : <CircularProgress /> }
    </div>
}
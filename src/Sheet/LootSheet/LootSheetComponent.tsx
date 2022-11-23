import {useWatchEntity} from "../../Util/Helper/EntityHelper";
import {LootSplitNGS} from "./LootAction";
import GoldSection from "./GoldSection";
import Style from "./LootSheet.module.scss"
import GoldDisplay from "../../Util/Components/GoldDisplay";
import getFlag from "../../Util/Helper/FlagHelper";
import {buildDesireMap, DEFAULT_LOOT_FLAG, LOOT_FLAG_ID, LootFlag} from "./LootFlags";
import LootSheetDesireComponent from "./LootSheetDesireComponent";
import {Button} from "@material-ui/core";
import {useCallback, useMemo} from "react";
import {NewItemTable} from "../../Util/Components/NewItemTable/NewItemTable";
import {DefaultItemColumns} from "../../Util/Components/NewItemTable/Item/ItemColumns";
import {StandardItemFilter} from "../../Util/Components/NewItemTable/Item/Filter/StandardItemFilter";
import {getterColumn} from "../../Util/Components/NewItemTable/Util/GetterColumn";
import {LootControls} from "./LootControls";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";
import {ItemExpander} from "../../Util/Components/NewItemTable/Item/ItemExpander";

const ValueIndColumn = getterColumn<Item>("Value (i)", item=><GoldDisplay value={item.price()} /> )
const ValueTotalColumn = getterColumn<Item>("Value (t)", item=><GoldDisplay value={item.qty() * item.price()} />)
const ValueWeightColumn = getterColumn<Item>("V/W", item=> item.weight() > 0 ? <GoldDisplay value={item.price() / item.weight()} /> : "-")

const Columns = [
    ...DefaultItemColumns,
    ValueIndColumn,
    ValueTotalColumn,
    ValueWeightColumn,
    {
        label: "",
        ColumnComponent: LootControls
    },
    {
        label: "Desire",
        ColumnComponent: LootSheetDesireComponent
    }
]

export default function LootSheetComponent({npc}) {
    useWatchEntity(npc)
    let self = useNewSelf()
    useWatchEntity(self)
    let selfId = self?.uuid
    let [flag, setFlag] = getFlag<LootFlag>(npc!, LOOT_FLAG_ID, DEFAULT_LOOT_FLAG)
    let mappedDesires = buildDesireMap(flag.desires)

    let items = npc!.items.filter(i=>i.type !== "spell")

    let extraData = useMemo(()=>({desires: mappedDesires, self, selfId, npc}), [mappedDesires, self, selfId, npc])
    let splitNGS = useCallback(()=>LootSplitNGS({lootId: npc?.uuid}), [npc])
    return <div>
        <div className={Style.header} style={{justifyContent: "space-evenly", alignItems: "center", }}>
            <GoldSection npc={npc}
                         disabled={!npc!.isOwner}
            />
            <div className="flex-row">
                <Button variant="outlined" style={{height: "64px"}} onClick={splitNGS}>Split NGS</Button>
            </div>
        </div>
        {items.length > 0 ? <NewItemTable items={items} expander={ItemExpander} extraData={extraData} filter={StandardItemFilter} columns={Columns}/> : null}
    </div>
}
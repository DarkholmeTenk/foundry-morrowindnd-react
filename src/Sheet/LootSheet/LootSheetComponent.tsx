import {useWatchEntity} from "Util/Helper/EntityHelper";
import {LootSplitNGS} from "./LootAction";
import GoldSection from "./GoldBox/GoldSection";
import Style from "./LootSheet.module.scss"
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {buildDesireMap, getLootFlag} from "./LootFlags";
import LootSheetDesireComponent from "./Desire/LootSheetDesireComponent";
import {Button} from "@mui/material";
import {useCallback, useMemo} from "react";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import {DefaultItemColumns} from "Util/Components/NewItemTable/Item/ItemColumns";
import {StandardItemFilter} from "Util/Components/NewItemTable/Item/Filter/StandardItemFilter";
import {getterColumn} from "Util/Components/NewItemTable/Util/GetterColumn";
import {LootControls} from "./LootControls";
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {ItemExpander} from "Util/Components/NewItemTable/Item/ItemExpander";
import {onItemDrop} from "Util/Helper/DropHelper";
import {addItem} from "Util/Helper/ItemTransferHelper";

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
    let selfId = self?.uuid
    let [flag] = getLootFlag(npc!)
    let mappedDesires = buildDesireMap(flag.desires)

    let items = npc!.items.filter(i=>i.type !== "spell")

    let drop = onItemDrop((i)=>{if(npc.isOwner) { addItem(npc, i) }})
    let extraData = useMemo(()=>({desires: mappedDesires, self, selfId, npc}), [mappedDesires, self, selfId, npc])
    let splitNGS = useCallback(()=>LootSplitNGS({lootId: npc?.uuid}), [npc])
    return <div onDrop={drop}>
        <div className={Style.header} style={{justifyContent: "space-evenly", alignItems: "center", }}>
            <GoldSection npc={npc}
                         disabled={!npc!.isOwner}
            />
        </div>
        {items.length == 0 ? <div>No Items available to loot!</div> : null}
        {items.length > 0 ? <NewItemTable items={items}
                                          expander={ItemExpander}
                                          extraData={extraData}
                                          filter={StandardItemFilter}
                                          columns={Columns}
                                          actions={()=><Button variant="outlined" style={{height: "32px"}} onClick={splitNGS}>Split NGS</Button>}
        /> : null}
    </div>
}
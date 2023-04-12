import {LeftFloatingPanel} from "Util/Components/LeftFloatingPanel/LeftFloatingPanel";
import {Suspense, useReducer} from "react";
import {SuspenseLayer} from "Util/Suspense/SuspenseLoadIndicator";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import doRollTable, {EncapsulatingRollData} from "Systems/RollTable/Rolling/TableRoller";
import {RollData} from "Systems/RollTable/Rolling/TableHelper";
import {CurrencyItem} from "Systems/RollTable/Rolling/TableGoldHelper";
import {getGoldAmount, getGoldValue} from "Util/Helper/GoldHelper";
import GoldDisplay from "Util/Components/GoldDisplay";
import ItemViewer, {ItemDataViewer} from "Util/Components/ItemViewer/ItemViewer";
import {Button} from "Util/Components/SimpleComponents";

function curr(data: RollData[]) {
    let value = 0
    data.forEach(x=>{
        if(x instanceof EncapsulatingRollData) {
            value += curr(x.rolls)
        } else if(x instanceof CurrencyItem) {
            value += getGoldAmount(x.values)
        }
    })
    return value
}

export function RollHelp({table}: {table: RollTable}) {
    let [id, refresh] = useReducer((x)=>x+1, 1)
    let data = useSuspensePromise("roll." + id, ()=> doRollTable(table))
    let gold = curr(data)
    let items = data.flatMap(i=>i.getItemData())
    return <div>
        <Button onClick={refresh}>Refresh</Button>
        {items.map((i, k)=><ItemDataViewer item={i} key={k} /> )}
        {gold > 0 ? <GoldDisplay value={gold} /> : null}
    </div>
}

export function HelperUI({table}: {table: RollTable}) {
    return <RollHelp table={table} />
}
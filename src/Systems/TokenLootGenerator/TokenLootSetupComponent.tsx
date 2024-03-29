import {useContext, useState} from "react";
import Selector from "Util/Components/Selector/Selector";
import {Button} from "@mui/material";
import ApplicationContext from "Util/React/core/ApplicationContext";
import {getTokenLootGeneratorFlag, RollTableChoice} from "Systems/TokenLootGenerator/TokenLootGeneratorFlag";
import ArrayHelper, {ArrayFunctionArgs} from "Util/Components/ArrayHelper";
import Styles from "Systems/TokenLootGenerator/TokenLootSetupComponent.module.scss"

function LootTableRow({value: table, setValue}: ArrayFunctionArgs<RollTableChoice>) {
    let tables = game.tables
    let rolltable = table.id ? tables.get(table.id) : undefined
    return <div className={Styles.Row}>
        <span className={Styles.Qty}>Qty: <input value={table.qty} onChange={(e)=>setValue({...table, qty: e.target.value})} /></span>
        <span className={Styles.Table}>Table: <Selector values={tables.contents} value={rolltable} setValue={(n)=>setValue({...table, id: n?.id ?? "Undefined"})} labelFunction={n=>n?.name ?? "Undefined"} /></span>
    </div>
}

interface Props {
    actor: Actor5e
}
export default function TokenLootSetupComponent({actor}: Props) {
    let [flag, setFlag] = getTokenLootGeneratorFlag(actor)
    let [rollTables, setRollTables] = useState(flag?.rollTableIds ?? [])
    let app = useContext(ApplicationContext)

    return <div>
        <ArrayHelper value={rollTables} setValue={setRollTables} component={LootTableRow} newValueGetter={{id: undefined, qty: ""}} />
        <Button onClick={async ()=>{
            await setFlag({rollTableIds: rollTables})
            await app.close()
        }}>Save</Button>
    </div>
}
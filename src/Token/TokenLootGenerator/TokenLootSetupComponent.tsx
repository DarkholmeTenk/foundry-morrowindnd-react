import {useCallback, useContext, useState} from "react";
import Selector from "../../Util/Components/Selector";
import {Button} from "@material-ui/core";
import ApplicationContext from "../../Util/React/core/ApplicationContext";
import {getTokenLootGeneratorFlag} from "./TokenLootGeneratorFlag";
import {useArrayReducers} from "../../Util/Helper/ArrayReducers";
import {useMappedSetter, useSetter} from "../../Util/React/update/Updater";

interface Props {
    actor: Actor5e
}
export default function TokenLootSetupComponent({actor}: Props) {
    let [flag, setFlag] = getTokenLootGeneratorFlag(actor)
    let tables = game.tables
    let [rollTables, setRollTables] = useState(flag?.rollTableIds ?? [])
    let [updateTable, addTable, removeTable] = useArrayReducers(setRollTables)
    let app = useContext(ApplicationContext)

    let first = tables.map(x=>x.id)[0]
    return <div>
        {rollTables.map((table, index)=>{
            let rolltable = tables.get(table.id)
            return <div>
                Qty: <input value={table.qty} onChange={(e)=>updateTable(index, {...table, qty: e.target.value})} />
                Table: <Selector values={tables.contents} value={rolltable} setValue={(n)=>updateTable(index, {...table, id: n.id})} labelFunction={n=>n.name} />
                <Button onClick={()=>removeTable(index)}>-</Button>
            </div>
        })}
        <Button onClick={()=>addTable({id: first, qty: ""})}>+</Button>
        <Button onClick={async ()=>{
            await setFlag({rollTableIds: rollTables})
            await app.close()
        }}>Save</Button>
    </div>
}
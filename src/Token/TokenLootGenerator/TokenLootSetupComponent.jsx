import {useCallback, useContext, useState} from "react";
import Selector from "../../Util/Components/Selector";
import {Button} from "@material-ui/core";
import AppContext from "../../Util/React/AppContext";

export default function TokenLootSetupComponent({flag, setFlag}) {
    let tables = game.tables
    let [rollTables, setRollTables] = useState(flag?.rollTableIds || [])
    let app = useContext(AppContext)
    let removeTable = useCallback((slot)=>{
        let newRollTables = [...rollTables]
        newRollTables.splice(slot, 1)
        setRollTables(newRollTables)
    }, [rollTables])
    let addTable = useCallback(()=>{
        setRollTables([...rollTables, {id: null, qty: "1"}])
    }, [rollTables])
    let updateTable = useCallback((slot, newValue)=>{
        let newTables = [...rollTables]
        newTables[slot] = newValue
        setRollTables(newTables)
    }, [rollTables])

    return <div>
        {rollTables.map((table, index)=>{
            let rolltable = tables.get(table.id)
            return <div>
                Qty: <input value={table.qty} onChange={(e)=>updateTable(index, {...table, qty: e.target.value})} />
                Table: <Selector values={tables.entities} value={rolltable} setValue={(n)=>updateTable(index, {...table, id: n.id})} labelFunction={n=>n.name} />
                <Button onClick={()=>removeTable(index)}>-</Button>
            </div>
        })}
        <Button onClick={addTable}>+</Button>
        <Button onClick={async ()=>{
            await setFlag({rollTableIds: rollTables})
            await app.close()
        }}>Save</Button>
    </div>
}
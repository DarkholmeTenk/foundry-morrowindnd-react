import {useCallback, useContext, useState} from "react";
import {e} from '../../Util/Helper/DomEventHelper'
import Selector from "../../Util/Selector";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";

export default function TokenLootSetupComponent({flag, setFlag}) {
    let tables = game.tables
    let [rollTables, setRollTables] = useState(flag?.rollTableIds || [])
    let app = useContext(AppContext)
    let removeTable = useCallback(e((slot)=>{
        let newRollTables = [...rollTables]
        newRollTables.splice(slot, 1)
        setRollTables(newRollTables)
    }), [rollTables])
    let addTable = useCallback(e(()=>{
        setRollTables([...rollTables, {id: null, qty: "1"}])
    }), [rollTables])
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
                <button onClick={()=>removeTable(index)}>-</button>
            </div>
        })}
        <button onClick={addTable}>+</button>
        <button onClick={e(async ()=>{
            await setFlag({rollTableIds: rollTables})
            app.close()
        })}>Save</button>
    </div>
}
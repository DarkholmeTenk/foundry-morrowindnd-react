import Selector from "../../Util/Selector";
import {useContext, useState} from "react";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";

export default function TableModifierComponent({flag, setFlag}) {
    let tables = game.tables
    let [table, setTable] = useState(flag?.tableId ? tables.get(flag.tableId) : null)
    let app = useContext(AppContext)
    return <div>
        Roll Table
        <Selector values={tables.entities} value={table} setValue={setTable} labelFunction={t=>t.name} includeNull />
        <button onClick={async ()=>{
            await setFlag({tableId: table.id})
            app.close()
        }}>Save</button>
    </div>
}
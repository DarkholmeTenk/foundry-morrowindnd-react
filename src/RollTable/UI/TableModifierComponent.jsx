import Selector from "../../Util/Components/Selector";
import {useContext, useState} from "react";
import {Button} from "@material-ui/core";
import AppContext from "../../Util/React/AppContext";

export default function TableModifierComponent({flag, setFlag}) {
    let tables = game.tables
    let [table, setTable] = useState(flag?.tableId ? tables.get(flag.tableId) : null)
    let app = useContext(AppContext)
    return <div>
        Roll Table
        <Selector values={tables.entities} value={table} setValue={setTable} labelFunction={t=>t.name} includeNull />
        <Button onClick={async ()=>{
            await setFlag({tableId: table.id})
            app.close()
        }}>Save</Button>
    </div>
}
import Selector from "Util/Components/Selector/Selector";
import {useContext, useState} from "react";
import {Button} from "@mui/material";
import ApplicationContext from "Util/React/core/ApplicationContext";
import getFlag from "Util/Helper/FlagHelper";
import {RollTableFlag, RollTableFlagKey} from "Systems/RollTable/FlagData/RollTableFlag";
import {useWatchEntity} from "Util/Helper/EntityHelper";

interface Props {
    table: RollTable
}
export default function TableModifierComponent({table}: Props) {
    useWatchEntity(table)
    let [flag, setFlag] = getFlag<RollTableFlag>(table, RollTableFlagKey, {})
    let tables = game.tables
    let [nestedTable, setNestedTable] = useState(flag?.tableId ? tables.get(flag.tableId) : null)
    let app = useContext(ApplicationContext)
    return <div>
        Roll Table
        <Selector values={tables.contents} value={nestedTable} setValue={setNestedTable} labelFunction={t=>t?.name ?? "Undefined"} includeNull />
        <Button onClick={async ()=>{
            await setFlag({tableId: nestedTable?.id})
            app.close()
        }}>Save</Button>
    </div>
}
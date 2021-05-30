import {useContext, useState} from "react";
import {Button, TextField} from "@material-ui/core";
import doRollTable from "../../RollTable/Rolling/TableRoller";
import AppContext from "../../Util/React/AppContext";

async function getResult(roll, qty, table) {
    let rollRoll = new Roll(roll).roll().total
    let qtyRoll = new Roll(qty).roll().total
    let result = []
    for(let i = 0; i < rollRoll; i++) {
        let rollResult = await doRollTable(table.id)
        result.push(...rollResult)
    }
    return result.map(r=>r.multiply(qtyRoll))
}

export default function TokenLootDropComponent({actor, table}) {
    let [roll, setRoll] = useState("1d3")
    let [qty, setQty] = useState("1")
    let app = useContext(AppContext)
    return <div>
        {table.name}
        <TextField label="Roll" value={roll} onChange={(e)=>setRoll(e.target.value)} />
        <TextField label="Qty" value={qty} onChange={(e)=>setQty(e.target.value)} />
        <Button onClick={async ()=>{
            let rollData = await getResult(roll, qty, table)
            let items = rollData.flatMap(r=>r.getItemData())
            let mods = {}
            rollData.forEach(r=>Object.assign(mods, r.getModifications(actor.data)))
            console.log("Roll result", items, mods)
        }}>Sample</Button>
        <Button onClick={async ()=>{
            let rollData = await getResult(roll, qty, table)
            let items = rollData.flatMap(r=>r.getItemData())
            let mods = {}
            rollData.forEach(r=>Object.assign(mods, r.getModifications(actor.data)))
            await actor.createOwnedItem(items)
            await actor.update(mods)
            app.close()
        }}>Add</Button>
    </div>
}
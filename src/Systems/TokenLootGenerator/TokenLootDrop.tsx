import TokenLootDropComponent from "./TokenLootDropComponent";
import {loadRollTable} from "Util/Identifiers/UuidHelper";
import {openReactApplication} from "Util/React/openReactApplication";

Hooks.on("dropActorSheetData", (actor, sheet, data)=>{
    if(data.type === "RollTable") {
        let id = data.uuid
        let table = loadRollTable.sync(id)
        if(!table) return
        openTokenLootDrop(actor, table)
    }
})

export function openTokenLootDrop(actor: Actor5e, table: RollTable) {
    openReactApplication(<TokenLootDropComponent actor={actor} table={table} />, {width: 400, height: 400})
}
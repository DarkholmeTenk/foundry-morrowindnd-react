import TokenLootDropComponent from "./TokenLootDropComponent";
import {SimpleReactApplication} from "Util/React/ReactApplication";

Hooks.on("dropActorSheetData", (actor, sheet, data)=>{
    if(data.type === "RollTable") {
        let id = data.id
        let table = game.tables.get(id)
        new SimpleReactApplication(<TokenLootDropComponent actor={actor} table={table} />, {width: 400, height: 400}).render(true)
    }
})
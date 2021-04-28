import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication";
import TokenLootDropComponent from "./TokenLootDropComponent";

Hooks.on("dropActorSheetData", (actor, sheet, data)=>{
    if(data.type === "RollTable") {
        let id = data.id
        let table = game.tables.get(id)
        new SimpleReactApplication(<TokenLootDropComponent actor={actor} table={table} />, {width: 400, height: 400}).render(true)
    }
})
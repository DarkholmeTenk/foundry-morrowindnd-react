import getLogger from "../../Util/Logging";
import doRollTable from "../Rolling/TableRoller";
import TableModifierComponent from "./TableModifierComponent";
import {openReactApplication} from "Util/React/openReactApplication";

const log = getLogger("TableModifier")


function openTableModifier(table: RollTable) {
    openReactApplication(<TableModifierComponent table={table} />, {width: 400, height: 150})
}

Hooks.on("rollTableConfigMenuItems", async (addMenuItem, app)=>{
    if(game.user.isGM) {
        addMenuItem({
            name: "Enchant",
            icon: '<i class="fas fa-hand-sparkles"></i>',
            callback: ()=>{
                log("Opening table", app.object)
                openTableModifier(app.object)
            }
        })
        addMenuItem({
            name: "Help",
            icon: '<i class="fas fa-dice"></i>',
            callback: async ()=>{
                let data = await doRollTable(app.object.id)
                let items = data.flatMap(i=>i.getItemData())
                log("Item Rolled", items, items.map(i=>i instanceof Item ? i.name : i.constructor.name))
            }
        })
    }
})
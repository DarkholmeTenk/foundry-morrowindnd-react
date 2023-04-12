import getLogger from "Util/Logging";
import doRollTable from "Systems/RollTable/Rolling/TableRoller";
import TableModifierComponent from "Systems/RollTable/UI/TableModifierComponent";
import {openReactApplication} from "Util/React/openReactApplication";
import {HelperUI} from "Systems/RollTable/HelperUI/HelperUI";

const log = getLogger("TableModifier")


function openTableModifier(table: RollTable) {
    openReactApplication(<TableModifierComponent table={table} />, {width: 400, height: 150})
}

Hooks.on("rollTableConfigMenuItems", async (addMenuItem, app: FormApplication<RollTable>)=>{
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
            callback: ()=>openReactApplication(<HelperUI table={app.object} />, {width: 400, height: 150})
        })
    }
})
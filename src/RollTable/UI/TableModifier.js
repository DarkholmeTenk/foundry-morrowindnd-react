import getLogger from "../../Util/Logging";
import doRollTable from "../Rolling/TableRoller";
import TableModifierComponent from "./TableModifierComponent";
import {SimpleReactApplication} from "../../Util/React/ReactApplication";

const log = getLogger("TableModifier")

function openTableModifier(table) {
    let flag = table.getFlag("morrowindnd", "enchant_spells")
    let setFlag = (v)=>table.setFlag("morrowindnd", "enchant_spells", v)
    new SimpleReactApplication(<TableModifierComponent flag={flag} setFlag={setFlag} />, {width: 400, height: 150}).render(true)
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
                let data = await doRollTable(app.object._id)
                let items = data.flatMap(i=>i.getItemData())
                log("Item Rolled", items, items.map(i=>i instanceof Item ? i.name : i.constructor.name))
            }
        })
    }
})
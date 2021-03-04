import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication";
import MergerUIComponent from "../../Item/Merger/MergerUIComponent";
import SalesUI from "./SalesUI";
import {getFlag} from "../../Util/FlagHelper";

Hooks.on("renderActorSheet", (app, html)=>{
    let actor = app.object
    if(app.constructor.name == "LootSheet5eNPC" && actor.isToken) {
        let isMerchant = actor.getFlag("lootsheetnpc5e", "lootsheettype") == "Merchant"
        if(isMerchant) {
            let section = html.find(".sheet-sidebar")
            let button = $("<button>Sell Items</button>")
            button.click((e)=>{
                let [flag, setFlag] = getFlag(actor, "seller_data", {rate: 0.2})
                let me = game.user.character
                me.sheet.render(true)
                new SimpleReactApplication(<SalesUI flag={flag} setFlag={setFlag} self={me} />, {width: 600, height: 800 } ).render(true)
            })
            section.append(button)
        }
    }
})
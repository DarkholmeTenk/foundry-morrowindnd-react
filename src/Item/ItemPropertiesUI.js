import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication";
import ItemPropertiesComponent from "./ItemPropertiesComponent";
import {getFlag} from "../Util/FlagHelper.ts";
import {getProperties} from "./ItemProperties";

Hooks.on("itemSheetMenuItems", async (addMenuItem, app)=>{
    let item = app.object
    if(game.user.isGM) {
        addMenuItem({
            name: "Set Properties",
            icon: '<i class="fas fa-hand-sparkles"></i>',
            callback: ()=>{
                let [flag, setFlag] = getProperties(item)
                new SimpleReactApplication(<ItemPropertiesComponent flag={flag} setFlag={setFlag}/>, {width:500, height: 600}).render(true)
            }
        })
    }
})
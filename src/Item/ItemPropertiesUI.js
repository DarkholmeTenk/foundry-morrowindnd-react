import ItemPropertiesComponent from "./ItemPropertiesComponent";
import {getProperties} from "./ItemProperties";
import {SimpleReactApplication} from "../Util/React/ReactApplication";

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
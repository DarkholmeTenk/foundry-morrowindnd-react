import {getFlag} from "../../Util/FlagHelper";
import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication";
import ItemPropertiesComponent from "../../Item/ItemPropertiesComponent";
import {fillActorSoulGem} from "./SoulGemHelper";

Hooks.on("actorSheetMenuItems", async (addMenuItem, app)=>{
    let item = app.object
    if(game.user.isGM) {
        addMenuItem({
            name: "Soul Steal",
            icon: '<i class="fas fa-hand-sparkles"></i>',
            callback: ()=>{
                let targets = game.user.targets
                targets.forEach((target)=>{
                    let actor = target.actor
                    fillActorSoulGem(item, actor)
                })
            }
        })
    }
})
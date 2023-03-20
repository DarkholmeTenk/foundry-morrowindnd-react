import TokenLootSetupComponent from "./TokenLootSetupComponent";
import {SimpleReactApplication} from "../../Util/React/ReactApplication";

Hooks.on("actorSheetMenuItems", (add, app, html, data)=>{
    let actor = app.object
    if(actor instanceof Actor && actor.isOwner && !actor.isToken && !actor.hasPlayerOwner) {
        add({
            name: "Loot",
            icon: '<i class="fas fa-utensils"></i>',
            callback: ()=>{
                new SimpleReactApplication(<TokenLootSetupComponent actor={actor} />, {width: 500, height: 500} ).render(true)
            }
        })
    }
})
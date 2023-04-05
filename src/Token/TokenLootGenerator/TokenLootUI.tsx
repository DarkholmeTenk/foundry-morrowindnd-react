import TokenLootSetupComponent from "./TokenLootSetupComponent";
import {openReactApplication} from "Util/React/openReactApplication";

Hooks.on("actorSheetMenuItems", (add, app, html, data)=>{
    let actor = app.object
    if(actor instanceof Actor && actor.isOwner && !actor.isToken && !actor.hasPlayerOwner) {
        add({
            name: "Loot",
            icon: '<i class="fas fa-utensils"></i>',
            callback: ()=>{
                openReactApplication(<TokenLootSetupComponent actor={actor} />, {width: 500, height: 500} )
            }
        })
    }
})
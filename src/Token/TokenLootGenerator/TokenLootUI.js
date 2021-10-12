import {ACTOR_FLAG} from "./TokenLootGenerator";
import TokenLootSetupComponent from "./TokenLootSetupComponent";
import {SimpleReactApplication} from "../../Util/React/ReactApplication";

Hooks.on("actorSheetMenuItems", (add, app, html, data)=>{
    let actor = app.object
    if(actor.isOwner && !actor.isToken && !actor.isPC) {
        add({
            name: "Loot",
            icon: '<i class="fas fa-utensils"></i>',
            callback: ()=>{
                let flag = actor.getFlag("morrowindnd", ACTOR_FLAG)
                let setFlag = (newValue)=>actor.setFlag("morrowindnd", ACTOR_FLAG, newValue)
                new SimpleReactApplication(<TokenLootSetupComponent flag={flag} setFlag={setFlag} />, {width: 400, height: 500} ).render(true)
            }
        })
    }
})
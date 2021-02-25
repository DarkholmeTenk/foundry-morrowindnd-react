import {fillActorSoulGem, getSoulGems} from "./SoulGemHelper";

Hooks.on("actorSheetMenuItems", async (addMenuItem, app)=>{
    let item = app.object
    if(game.user.isGM && getSoulGems(item, x=>!x.fillSize).length > 0) {
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
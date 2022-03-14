import {mergeItemData} from "../../Util/Helper/ItemHelper.ts";
import LogFactory from "../../Util/Logging";

const log = LogFactory("LootSheetCreator")
const FLAG = "LootedFlag"
const BlacklistedTypes = ["class", "spell", "feat"]

function isLootSheet(actor) {
    let sheet = actor.sheet.constructor.name
    return actor.isToken && (sheet === "LootSheet5eNPC" || sheet.includes("Loot"))
}

function canBeLooted(token, lootContainer) {
    let flag = token.getFlag("morrowindnd", FLAG)
    if(flag) {
        let {container} = flag
        return container === lootContainer.id
    } else {
        return true
    }
}

function getBaseActor(token) {
    return game.actors.get(token.data.actorId)
}

function getCurrency(token) {
    return token.data.actorData?.data?.currency?.gp?.value || 0
}

async function lootTokens(lootContainer, tokens) {
    log.debug("Looting Tokens", lootContainer, tokens)
    let items = tokens.flatMap(token=>{
        let actor = getBaseActor(token)
        let tokenItems = token.actor.items || []
        return tokenItems
            .filter(i=>!actor.items.get(i.id))
            .filter(i=>!BlacklistedTypes.includes(i.type))
            .map(i=>i.data)
    })
    let mergedItems = mergeItemData(items)
    let currency = tokens.map(token=>getCurrency(token)).reduce((p,c)=>p+c, 0)
    await tokens.forEachAsync((token)=>token.setFlag("morrowindnd", FLAG, {container: lootContainer.id}))
    await lootContainer.token.update({"actorData.items": [], "actorData.data.currency.gp.value": currency})
    await lootContainer.createEmbeddedDocuments("Item", mergedItems)
}

Hooks.on("actorSheetMenuItems", (add, app)=>{
    let actor = app.object
    if(game.user.isGM) {
        if(isLootSheet(actor)) {
            add({
                name: "Loot Tokens",
                icon: '<i class="fas fa-shopping-bag"></i>',
                callback: async ()=>{
                    let selected = canvas.tokens.controlled
                        .filter(t=>canBeLooted(t, actor))
                        .filter(t=>t.actor !== actor)
                        .filter(t=>!t.actor.isPC)
                    await lootTokens(actor, selected)
                }
            })
        }
        if(actor.isToken && actor.getFlag("morrowindnd", FLAG)) {
            add({
                name: "Reset Loot Status",
                icon: '<i class="fas fa-shopping-bag"></i>',
                callback: async ()=>{
                    await actor.unsetFlag("morrowindnd", FLAG)
                }
            })
        }
    }
})
import {mergeItemData} from "Util/Helper/ItemHelper";
import LogFactory from "Util/Logging";
import {addItem} from "Util/Helper/ItemTransferHelper";
import {migrate} from "Util/Helper/FlagMigrationHelper";
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";
import {getGoldAmountFromActor, getGoldBreakdown} from "Util/Helper/GoldHelper";

const log = LogFactory("LootSheetCreator")
const LootedFlagKey = "LootedFlag"
const BlacklistedTypes = ["class", "spell", "feat"]

interface LootedFlagData {
    container: UUID
}

function isLootSheet(actor: Actor5e) {
    let sheet = actor.sheet?.constructor?.name ?? ""
    return actor.isToken && (sheet === "LootSheet5eNPC" || sheet.includes("Loot"))
}

function canBeLooted(token: Token, lootContainer) {
    if(token.actor.hasPlayerOwner) return false
    let flag = token.getFlag<LootedFlagData>(FLAG_SCOPE, LootedFlagKey)
    if(flag) {
        let {container} = flag
        return container === lootContainer.uuid
    } else {
        return true
    }
}

function getBaseActor(token: TokenDocument) {
    return game.actors.get(token._source.actorId)
}

function getCurrency(token: TokenDocument) {
    return getGoldAmountFromActor(token.actor)
}

async function lootTokens(lootContainer: Actor5e, tokens: TokenDocument[]) {
    log.debug("Looting Tokens", lootContainer, tokens)
    let items = tokens.flatMap(token=>{
        let actor = getBaseActor(token)
        if(!actor) return []
        let rActor = actor
        let tokenItems = token.actor.items || []
        return tokenItems
            .filter(i=>!rActor.items.get(i.id))
            .filter(i=>!BlacklistedTypes.includes(i.type))
            .map(i=>i._source)
    })
    let mergedItems = mergeItemData(items)
    let currency = tokens.map(token=>getCurrency(token)).reduce((p,c)=>p+c, 0)
    let breakdown = getGoldBreakdown(currency)
    await tokens.forEachAsync((token)=>token.setFlag(FLAG_SCOPE, LootedFlagKey, {container: lootContainer.id}))
    await lootContainer.token?.update({"actorData.items": [], "actorData.system.currency": breakdown})
    await addItem(lootContainer, mergedItems)
}

Hooks.on("actorSheetMenuItems", (add, app: FormApplication<Actor5e>)=>{
    let actor = app.object
    if(game.user.isGM) {
        if(isLootSheet(actor)) {
            add({
                name: "Loot Tokens",
                icon: '<i class="fas fa-shopping-bag"></i>',
                callback: async ()=>{
                    let selected = canvas.tokens.controlled
                        .map(x=>x.document)
                        .filter(t=>canBeLooted(t, actor))
                        .filter(t=>t.actor !== actor)
                        .filter(t=>!t.actor.hasPlayerOwner)
                    await lootTokens(actor, selected)
                }
            })
        }
        if(actor.token && actor.token.getFlag(FLAG_SCOPE, LootedFlagKey)) {
            add({
                name: "Reset Loot Status",
                icon: '<i class="fas fa-shopping-bag"></i>',
                callback: async ()=>{
                    await actor.token?.unsetFlag(FLAG_SCOPE, LootedFlagKey)
                }
            })
        }
    }
})
Hooks.on("ready", ()=>migrate(game.actors, {oldScope: "morrowindnd", oldKey: LootedFlagKey}))
import {TokenSettings} from "Settings/token/TokenSettings";
import {loadActor} from "Util/Identifiers/UuidHelper";
import {getLootable, lootTokens} from "Systems/TokenLootAggregator/LootAggregator";
import {ChatTool} from "Systems/Tools/ChatTools";

export async function createLootToken() {
    let lootTokenBase = TokenSettings.value.lootTokenBase
    if(!lootTokenBase) return
    let lootActor = await loadActor(lootTokenBase)
    if(!lootActor) return

    let toLoot = getLootable(undefined)
    if(toLoot.length === 0) return
    let data = toLoot.map(x=>({x: x.x / toLoot.length, y: x.y / toLoot.length})).reduce((p,c)=>({x: p.x + c.x, y: p.y + c.y}))
    const td = await lootActor.getTokenDocument({x: data.x, y: data.y});

    let lootTokenData = await lootActor.getTokenDocument(data)
    const hw = canvas.grid.w/2;
    const hh = canvas.grid.h/2;
    lootTokenData.updateSource(canvas.grid.getSnappedPosition(td.x - (td.width*hw), td.y - (td.height*hh)));

    let token: TokenDocument = await (lootTokenData.constructor as any).create(lootTokenData, {parent: canvas.scene})

    await lootTokens(token.actor, toLoot)
}

Hooks.on("getChatTools", (tools: ChatTool[])=>{
    if(!game.user.isGM) return
    tools.push({
        name: "Loot Tokens",
        icon: "fas fa-people-robbery",
        onClick: createLootToken
    })
})

interface Control {
    name: string,
    tools: {
        name: string
        icon: string
        title: string
        onClick: ()=>void
    }[]
}
Hooks.on("getSceneControlButtons", (controls: Control[]) => {
    if(!game.user.isGM) return
    controls.find(x=>x.name === "token")?.tools.push({
        name: "Loot",
        icon: "fas fa-people-robbery",
        title: "Loot",
        onClick: createLootToken
    })
})
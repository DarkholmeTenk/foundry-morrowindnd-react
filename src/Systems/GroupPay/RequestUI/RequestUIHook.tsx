import {openRequestUI} from "Systems/GroupPay/RequestUI/openRequestUI";
import {ChatTool} from "Systems/Tools/ChatTools";

const ID = "MorrowinDnD-RequestMoney"

Hooks.on("getChatTools", (tools: ChatTool[])=>{
    if(!game.user.isGM) return
    tools.push({ name: "Request GM Money", icon: "fas fa-money-bill-wave", onClick: ()=>openRequestUI({type: "dm"})})
})

Hooks.on("renderActorSheet", (app: FormApplication<Actor5e>, html: JQuery<HTMLElement>)=>{
    if(!app.object.hasPlayerOwner) return
    if(app.object.type === "npc") return
    if(html.find("#" + ID).length > 0) return
    let currencyBlock = html.find(".currency").find("h3")
    if(currencyBlock.length === 0) return
    let open = () => openRequestUI({type: "actor", actorId: app.object.uuid})
    let btn = $(`<a id='${ID}' data-tooltip="Request Money"><i class="fa-solid fa-money-bill-wave" /></a>`)
    btn.on({click: open})
    currencyBlock.append(btn)
})
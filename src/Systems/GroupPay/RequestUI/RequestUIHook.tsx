import {openReactApplication} from "Util/React/openReactApplication";
import {RequestUIComponent} from "Systems/GroupPay/RequestUI/RequestUIComponent";

const ID = "MorrowinDnD-RequestMoney"

Hooks.on("renderActorSheet", (app: FormApplication<Actor5e>, html: JQuery<HTMLElement>)=>{
    if(!app.object.hasPlayerOwner) return
    if(app.object.type === "npc") return
    if(html.find("#" + ID).length > 0) return
    let currencyBlock = html.find(".currency").find("h3")
    if(currencyBlock.length === 0) return
    let open = ()=>{openReactApplication(<RequestUIComponent actor={app.object} />, {width: 500, height: 250})}
    let btn = $(`<a id='${ID}' data-tooltip="Request Money"><i class="fa-solid fa-money-bill-wave" /></a>`)
    btn.on({click: open})
    currencyBlock.append(btn)
})
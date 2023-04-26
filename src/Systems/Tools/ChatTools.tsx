import {openReactApplication} from "Util/React/openReactApplication";
import {RequestUIComponent} from "Systems/GroupPay/RequestUI/RequestUIComponent";
import Styles from "./ChatTools.module.scss"
import {e} from "Util/Helper/DomEventHelper";
import {openToolsApplication} from "Systems/Tools/OpenToolsApplication";
import {openRequestUI} from "Systems/GroupPay/RequestUI/openRequestUI";

const ToolsID = "MorrowinDnD-ChatTools"

function createButton(title: string, icon: string, onClick: ()=>void) {
    let btn = $(`<a data-tooltip="${title}"><i class="${icon}" /></a>`)
    btn.on({click: e(onClick)})
    return btn
}

export interface ChatTool {
    name: string,
    icon: string,
    onClick: ()=>void
}

Hooks.on("getChatTools", (tools: ChatTool[])=> {
    tools.push({name: "Toolbox", icon: "fas fa-toolbox", onClick: openToolsApplication})
})

Hooks.on("renderChatLog", (app: Application, html: JQuery<HTMLElement>)=>{
    if(html.find("#" + ToolsID).length > 0) return
    let existingControls = html.find("#chat-controls")
    if(existingControls.length === 0) return
    let myBlock = $(`<div id='${ToolsID}' class='flexrow ${Styles.ChatControls}'></div>`)
    let tools: ChatTool[] = []
    Hooks.call("getChatTools", tools)
    tools.forEach((t)=>{
        myBlock.append(createButton(t.name, t.icon, t.onClick))
    })
    myBlock.append("<span>Hello!</span>")
    existingControls.after(myBlock)
})
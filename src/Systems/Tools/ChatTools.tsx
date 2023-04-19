import {openReactApplication} from "Util/React/openReactApplication";
import {RequestUIComponent} from "Systems/GroupPay/RequestUI/RequestUIComponent";
import Styles from "./ChatTools.module.scss"
import {e} from "Util/Helper/DomEventHelper";
import {openToolsApplication} from "Systems/Tools/OpenToolsApplication";

const ToolsID = "MorrowinDnD-ChatTools"

function createButton(title: string, icon: string, onClick: ()=>void) {
    let btn = $(`<a data-tooltip="${title}"><i class="${icon}" /></a>`)
    btn.on({click: e(onClick)})
    return btn
}

Hooks.on("renderChatLog", (app: Application, html: JQuery<HTMLElement>)=>{
    if(html.find("#" + ToolsID).length > 0) return
    let existingControls = html.find("#chat-controls")
    if(existingControls.length === 0) return
    let myBlock = $(`<div id='${ToolsID}' class='flexrow ${Styles.ChatControls}'></div>`)
    if(game.user.isGM) {
        myBlock.append(createButton("Request GM Money", "fa-solid fa-money-bill-wave", ()=>{
            openReactApplication(<RequestUIComponent requester={{type: "dm"}} />, {width: 500, height: 250})
        }))
    }
    myBlock.append(createButton("Toolbox", "fas fa-toolbox", ()=>openToolsApplication()))
    myBlock.append("<span>Hello!</span>")
    existingControls.after(myBlock)
})
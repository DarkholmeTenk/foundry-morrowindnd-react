import {openReactApplication} from "Util/React/openReactApplication";
import {RequestUIComponent} from "Systems/GroupPay/RequestUI/RequestUIComponent";
import Styles from "./ChatTools.module.scss"

const ToolsID = "MorrowinDnD-ChatTools"

Hooks.on("renderChatLog", (app: Application, html: JQuery<HTMLElement>)=>{
    if(html.find("#" + ToolsID).length > 0) return
    let existingControls = html.find("#chat-controls")
    if(existingControls.length === 0) return
    let myBlock = $(`<div id='${ToolsID}' class='flexrow ${Styles.ChatControls}'></div>`)
    if(game.user.isGM) {
        let open = ()=>{openReactApplication(<RequestUIComponent requester={{type: "dm"}} />, {width: 500, height: 250})}
        let btn = $(`<a data-tooltip="Request Money"><i class="fa-solid fa-money-bill-wave" /></a>`)
        btn.on({click: open})
        myBlock.append(btn)
    }
    myBlock.append("<span>Hello!</span>")
    existingControls.after(myBlock)
})
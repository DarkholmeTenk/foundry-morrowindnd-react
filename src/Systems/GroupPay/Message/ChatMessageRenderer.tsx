import {hasGroupPayFlag, useGroupPayFlag} from "../Model/GroupPayFlag";
import {openGroupPay} from "../Sheet/GroupPayApplication";

Hooks.on("renderChatMessage", (message: ChatMessage, html: {0: HTMLElement})=>{
    if(!hasGroupPayFlag(message)) return
    let [flag] = useGroupPayFlag(message)
    if(!flag.paid) {
        let div = Array.from(html[0].children).find(x=>x.className == "message-content")
        let button = document.createElement("button")
        button.innerText = "Open Payment Sheet"
        button.onclick = ()=>openGroupPay(message.id)
        div?.appendChild(button)
    }
})
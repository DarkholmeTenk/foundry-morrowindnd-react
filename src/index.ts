import "./NPCMaker/NPCMaker"
import "./RollTable"
import "./Token"
import "./Item"
import "./Systems"
import "./Constants"
import "Util/index"
import "./Sheet"
import "./index.scss"
import {magickaReady} from "./Systems/Magicka/magicka";
import {createGroupPayMessage} from "./Systems/GroupPay/Message/CreateGroupPayMessage";

Hooks.on("ready", ()=>{
    magickaReady()
})

window.MorrowinDnDReact = {
    createGroupPayMessage
}
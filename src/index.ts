import "./NPCMaker/NPCMaker"
import "./RollTable"
import "./Token"
import "./Item"
import "./Systems"
import "./Constants"
import "./Util"
import "./Sheet"
import "./index.scss"
import {magickaReady} from "./Systems/Magicka/magicka";

Hooks.on("ready", ()=>{
    magickaReady()
})
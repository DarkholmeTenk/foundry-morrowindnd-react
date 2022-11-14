import ActorSheet5eCharacter from "../../../../systems/dnd5e/module/actor/sheets/character.js";
import ActorSheet5eNPC from "../../../../systems/dnd5e/module/actor/sheets/npc.js";
import ItemSheet5e from "../../../../systems/dnd5e/module/item/sheet.js";
import {DND5E} from "../../../../systems/dnd5e/module/config.js"
let exports = {ActorSheet5eNPC, ActorSheet5eCharacter, ItemSheet5e, DND5E}
Object.keys(exports).forEach(k=>window[k] = exports[k])
let scripts = document.head.getElementsByTagName("script")
let currentScriptURL = null
for(let i=0;i<scripts.length;i++) {
    let script = scripts[i]
    let src = script.src
    if(src.toLowerCase().includes("morrowindndreact")) {
        currentScriptURL = src.replace("load.js", "")
    }
}

if(window.location.hostname === "localhost") {
    import("http://localhost:8080/bundle.js")
} else {
    import("./dist/bundle.js")
}
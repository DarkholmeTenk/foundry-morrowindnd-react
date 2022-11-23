window.ActorSheet5eNPC = dnd5e.applications.actor.ActorSheet5eNPC
window.ActorSheet5eCharacter = dnd5e.applications.actor.ActorSheet5eCharacter
window.ItemSheet5e = dnd5e.applications.item.ItemSheet5e
window.DND5E = dnd5e.config


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
    import("../dist/bundle.js")
}
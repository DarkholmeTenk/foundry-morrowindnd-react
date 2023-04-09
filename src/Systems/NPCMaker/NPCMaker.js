import NPCMakerComponent from "./NPCMakerComponent";
import React from "react";
import {SimpleReactApplication} from "Util/React/ReactApplication";

let loaded = false

function loadedStart() {
    if(!game?.user?.isGM) return
    if(!document.getElementById("actors")) return
    if(loaded) return
    loaded = true
    let gameSettings = document.getElementById("actors").getElementsByClassName("directory-footer").item(0)
    if(!gameSettings) return;
    if(gameSettings.getElementsByClassName('morrowindnd-generate-npc').length > 0) return
    let newButton = document.createElement("button")
    newButton.innerText = "Generate NPC"
    newButton.className = "morrowindnd-generate-npc"
    newButton.onclick = ()=>new SimpleReactApplication(<NPCMakerComponent />, {width:700, height: 800}).render(true)
    gameSettings.appendChild(newButton)
}

Hooks.on("renderActorDirectory", loadedStart)
Hooks.on("ready", loadedStart)

setTimeout(()=>loadedStart(), 1000)
import {SimpleReactApplication} from "../../Util/React/ReactApplication";
import CraftingSheetComponent from "./CraftingSheetComponent";

Hooks.on("getSceneControlButtons", (controls)=>{
    console.log(controls)
    let tokenControls = controls.find(x=>x.name === "token")
    if(tokenControls) {
        tokenControls.tools.push({
            name: "MW Crafting",
            title: "MW Crafting",
            icon: "fas fa-tools",
            onClick: ()=> new SimpleReactApplication(<CraftingSheetComponent />, {width: 700, height: 800}).render(true),
            visible: true,
            button: true
        })
    }
})
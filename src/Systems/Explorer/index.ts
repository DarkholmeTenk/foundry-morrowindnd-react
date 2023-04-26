import {TravelCanvasLayer} from "Systems/Traveller/Canvas/canvas";
import {openToolsApplication} from "Systems/Tools/OpenToolsApplication";
import {ExplorerLayer} from "Systems/Explorer/ExplorerLayer";

Hooks.once("init", canvas => {
    CONFIG.Canvas.layers['ExplorerLayer'] = {group: "interface", layerClass: ExplorerLayer}
});
Hooks.on("getSceneControlButtons", (controls) => {
    let tools = [
        {
            name: "Mark Region",
            title: "Plan Travel",
            icon: "far fa-compass",
        },
        {
            name: "Tools",
            title: "Tools",
            icon: "fas fa-toolbox",
            onClick: openToolsApplication
        }
    ]
    controls.push({
        name: "explorer",
        title: "Explorer",
        icon: "fas fa-person-hiking",
        layer: "ExplorerLayer",
        tools,
    });
});
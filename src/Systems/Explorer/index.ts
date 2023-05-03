import {ExplorerLayer} from "Systems/Explorer/ExplorerLayer";
import {openRegionEditor} from "Systems/Explorer/Regions/Editor/RegionEditor";

Hooks.once("init", canvas => {
    CONFIG.Canvas.layers['ExplorerLayer'] = {group: "interface", layerClass: ExplorerLayer}
});
Hooks.on("getSceneControlButtons", (controls) => {
    let tools = [
        {
            name: "select",
            title: "Select Region",
            icon: "far fa-compass",
        },
        {
            name: "z",
            title: "Tools",
            icon: "fas fa-toolbox"
        },
        {
            name: "Regions",
            title: "Regions",
            icon: "fas fa-map-location",
            button: true,
            onClick: openRegionEditor
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
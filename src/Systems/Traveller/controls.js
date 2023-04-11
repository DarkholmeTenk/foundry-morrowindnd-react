import { TravellerSettings } from './Settings.js';
import LogFactory from "../../Util/Logging";
import {SimpleReactApplication} from "Util/React/ReactApplication";
import TravelPlanner from "./Planner/TravelPlanner";
import {openToolsApplication} from "../Tools/OpenToolsApplication";

const log = LogFactory("Traveller_Controls")

log("Initialising control hooks")

Hooks.on("getSceneControlButtons", (controls) => {
    let tools = [
        ...TravellerSettings.Togglers.map(setting => ({
            name: setting.name,
            title: `Traveller.${setting.name}`,
            icon: setting.data.icon,
            active: setting.value,
            toggle: true,
            onClick: () => setting.toggle()
        })),
        {
            name: "Plan Travel",
            title: "Plan Travel",
            icon: "far fa-compass",
            onClick: ()=>{
                new SimpleReactApplication(<TravelPlanner />).render(true, {width: 700, height: 800})
            }
        },
        {
            name: "Tools",
            title: "Tools",
            icon: "fas fa-toolbox",
            onClick: openToolsApplication
        }
    ]
    controls.push({
        name: "travel",
        title: "Traveller.Controls",
        icon: "fas fa-route",
        layer: "TravelCanvasLayer",
        tools,
    });
});

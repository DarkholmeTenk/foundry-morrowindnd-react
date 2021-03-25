import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication.jsx";
import {connect, Provider} from "react-redux";
import {refreshTravelState, TravelStore} from "./State/TravelStore";
import TravelUIComponent from "./UI/TravelUIComponent";
import {setupSetting} from "../Constants/Config";

const Wrapped = connect((state)=>({state}))(TravelUIComponent)

const IS_ENABLED = setupSetting({
    key: "Travel.UI.Enabled",
    name: "Enable Travel UI",
    default: false,
    type: Boolean,
})

Hooks.on("getSceneControlButtons", (controls) => {
    if(!IS_ENABLED.value) return
    controls.find(x => x.name == "token").tools.push({
        name: "morrowindnd.travel",
        title: "morrowindnd.travel",
        icon: "fas fa-compass",
        visible: true,
        button: true,
        onClick: () => {
            refreshTravelState({})
            new SimpleReactApplication(<Provider store={TravelStore}><Wrapped/></Provider>, {
                width: 600,
                height: 400
            }).render(true)
        }
    })
});

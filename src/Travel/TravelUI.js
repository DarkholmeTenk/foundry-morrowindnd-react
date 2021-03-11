import {SimpleReactApplication} from "../../../FoundryReactCore/src/Util/ReactApplication";
import {connect, Provider} from "react-redux";
import {refreshTravelState, TravelStore} from "./State/TravelStore";
import TravelUIComponent from "./TravelUIComponent";

const Wrapped = connect((state)=>({state}))(TravelUIComponent)

Hooks.on("getSceneControlButtons", (controls) => {
    controls.find(x=>x.name=="token").tools.push({
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

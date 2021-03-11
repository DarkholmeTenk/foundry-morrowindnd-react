import TravelTaskComponent from "./TravelTaskComponent";
import {dispatchTravelAction, set} from "./State/TravelStore";
import TravelState, {defaultTravelStateData} from "./State/TravelState";
import {useState} from "react";

function ResetButton({}) {
    return <button onClick={()=>{
        dispatchTravelAction(set(defaultTravelStateData))
    }}>Reset</button>
}

function RollButton({state}) {
    let [rolls, setRolls] = useState([])
    return <div>
        <pre>{JSON.stringify(rolls)}</pre>
        <button onClick={async ()=>{
            let travelState = new TravelState(state)
            let newTravelState = await travelState.roll(false)
            dispatchTravelAction(set(newTravelState.data))
        }}>Roll</button>
    </div>
}

export default function TravelUIComponent({state}) {
    return <div>
        <pre>{JSON.stringify(state)}</pre>
        <TravelTaskComponent taskData={state.tasks.navigation} title="navigation" />
        <TravelTaskComponent taskData={state.tasks.foraging} title="foraging" />
        {game.user.isGM ? <RollButton state={state}/> : null}
        {game.user.isGM ? <ResetButton/> : null}
    </div>
}
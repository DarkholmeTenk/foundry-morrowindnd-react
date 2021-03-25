import TravelTaskComponent from "./TravelTaskComponent";
import {TaskTypes} from "../State/TaskData";

function ResetButton({state}) {
    return <button onClick={()=>state.reset()}>Reset</button>
}

function RollButton({state}) {
    return <div>
        <pre>{JSON.stringify(state.rolls)}</pre>
        <button onClick={()=>state.roll()}>Roll</button>
    </div>
}

export default function TravelUIComponent({state}) {
    return <div>
        <pre>{JSON.stringify(state)}</pre>
        {state.speed}
        <button onClick={()=>state.speed = "slow"}>X</button>
        <TravelTaskComponent taskData={state.getTask(TaskTypes.navigation)} state={state} title="navigation" />
        <TravelTaskComponent taskData={state.getTask(TaskTypes.foraging)} state={state} title="foraging" />
        {game.user.isGM ? <RollButton state={state}/> : null}
        {game.user.isGM ? <ResetButton state={state}/> : null}
    </div>
}
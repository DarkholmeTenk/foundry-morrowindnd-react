import {dispatchTravelAction, setActorTask, setTask} from "./State/TravelStore";

export default function TravelTaskComponent({title, taskData}) {
    return <div>
        <h2>{title}</h2>
        <pre>{JSON.stringify(taskData)}</pre>
        <button onClick={()=>{
            let me = game.user.character.id
            dispatchTravelAction(setActorTask({task: title, actor: me}))
        }}>Add Me</button>
    </div>
}
import ItemViewer from "../../Util/ItemViewer";
import {TaskInfos} from "../State/TaskData";
import Styles from "./Travel.module.scss"
import {useState} from "react";
import ItemDescription from "../../Util/Components/ItemDescription";

function TaskActorViewer({actorId, rolls}) {
    let roll = (rolls || []).find(x=>x.actor === actorId)
    let actor = game.actors.get(actorId)
    return <ItemViewer item={actor} />
}

function Header({taskDetails, taskData}) {
    let className = Styles.header
    if(taskData.advantage && !taskData.disadvantage) className += " " + Styles.advantage
    if(taskData.disadvantage && !taskData.advantage) className += " " + Styles.disadvantage
    return <span className={className}>
            <h2>{taskDetails.label}</h2>
            <h3>{taskDetails.stat.label}</h3>
        </span>
}

export default function TravelTaskComponent({title, state, taskData}) {
    let taskDetails = TaskInfos[title]
    let [text,setText] = useState()
    return <div>
        <Header taskData={taskData} taskDetails={taskDetails} />
        <div>
            {taskData.actors.map(id=><TaskActorViewer actorId={id} key={id} rolls={taskData.rolls}/> )}
        </div>
        <input value={taskData.dc} onChange={(e)=>taskData.setDC(parseInt(e.target.value))} />
        <pre>{JSON.stringify(taskData)}</pre>
        <button onClick={()=>{
            let me = game.user.character.id
            state.setActorTask(me, title)
        }}>Add Me</button>
        <textarea onPaste={(e)=>{
            setText(e.clipboardData.getData("text/html"))
        }} value={text}/>
        <ItemDescription description={text} />
    </div>
}
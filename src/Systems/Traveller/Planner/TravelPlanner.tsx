import React from "react"
import useSelf, {useCanvasToken, useParty} from "../../../Util/Components/SelfActorSelector";
import {getSceneNoteData} from "../Data/NoteDataUtil";
import {NoteData} from "../Data/NoteData";
import {calculateDijkstra, DijkstraData} from "./Dijkstra";
import {Jump} from "./Jumps";
import {TimeSorter} from "./JumpSorter";

function name(note: NoteData | undefined) {
    return note?.note?.name ?? note?.entry?.name ?? "Unknown Location"
}

function JumpRow({jump}: {jump: Jump}) {
    return <div className="flex-row" style={{width: '100%', justifyContent: "space-between"}}>
        <span>{name(jump.from)} to {name(jump.to)}</span>
        <div className="flex-row" style={{width: '30%', justifyContent: "space-between"}}>
            <span>{jump.desc}</span>
            <span>{jump.cost}gp</span>
            <span>{jump.time} hours</span>
        </div>
    </div>
}

function DijkstraDataRow({row}: {row: DijkstraData}) {
    let jumps = row.jumps.map((jump, index)=><JumpRow jump={jump} key={index} />)
    return <div style={{width: '100%', borderBottom: "1px solid black"}}>
        <div className="flex-row" style={{width: '100%', justifyContent: "space-between"}}>
            <h2>{name(row.note)}</h2>
            <div className="flex-row" style={{width: '30%', justifyContent: "space-between"}}>
                <div><h3>{row.cost}gp</h3></div>
                <div><h3>{row.time} hours</h3></div>
            </div>
        </div>
        <div style={{marginLeft: '10px'}}>
            {jumps}
        </div>
    </div>
}

interface SceneTravelPlannerArgs {
    party: Actor,
    partyToken: TokenDocument,
    noteData: NoteData[]
}
function SceneTravelPlanner({party, partyToken, noteData}: SceneTravelPlannerArgs) {
    let dijkstra = calculateDijkstra(partyToken.data, noteData, TimeSorter.sorter)
    return <>
        {Object.keys(dijkstra).map(k=><DijkstraDataRow key={k} row={dijkstra[k]} />)}
    </>
}

export default function TravelPlanner() {
    let {actor, component} = useParty()
    let token = useCanvasToken(canvas?.scene!, actor)
    let scene = canvas?.scene
    let sceneData = scene ? getSceneNoteData(scene) : undefined
    if(sceneData && sceneData.length > 1) {
        if (actor && token) {
            return <div style={{width: '100%'}}>
                {component}
                <SceneTravelPlanner party={actor} partyToken={token} noteData={sceneData}/>
            </div>
        } else if (sceneData) {
            return <>
                {component}
            </>
        }
    } else {
        return <>
            No travel data on the current scene
        </>
    }
}
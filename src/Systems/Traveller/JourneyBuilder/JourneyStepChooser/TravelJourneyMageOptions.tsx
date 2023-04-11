import {NoteData} from "Systems/Traveller/Data/NoteData";
import {JourneyAddStepButton} from "Systems/Traveller/JourneyBuilder/JourneyStepChooser/JourneyAddStepButton";
import {useTravelJourneyContext} from "Systems/Traveller/JourneyBuilder/TravelJourneyBuilder";

export function TravelJourneyMageOptions({current}: {current: NoteData}) {
    let {sceneData} = useTravelJourneyContext()
    if(!current.travel.mages) return null
    let allMages = sceneData.filter(x=>x.travel.mages && x !== current)
    return <div>
        <h3>
            Mage's Guild Transport
        </h3>
        <ul>
            {allMages.map((x)=><JourneyAddStepButton from={current} step={{method: "mages", target: x.entry.id}} text={""} key={x.entry.id}/>)}
        </ul>
    </div>
}
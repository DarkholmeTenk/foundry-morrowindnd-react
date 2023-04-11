import {NoteData} from "Systems/Traveller/Data/NoteData";
import {getClosestIntervention} from "Systems/Traveller/JourneyBuilder/TravelJourneyUtil";
import {useTravelJourneyContext} from "Systems/Traveller/JourneyBuilder/TravelJourneyBuilder";
import {JourneyAddStepButton} from "Systems/Traveller/JourneyBuilder/JourneyStepChooser/JourneyAddStepButton";
import {
    TravelJourneySimpleOptions
} from "Systems/Traveller/JourneyBuilder/JourneyStepChooser/TravelJourneySimpleOptions";
import {TravelJourneyMageOptions} from "Systems/Traveller/JourneyBuilder/JourneyStepChooser/TravelJourneyMageOptions";

interface IProps {
    current: NoteData
}

function Intervention({current}: IProps) {
    let {sceneData} = useTravelJourneyContext()
    let closestDivine = getClosestIntervention("divine", sceneData, current.note)
    let closestAlmsivi = getClosestIntervention("almsivi", sceneData, current.note)
    if(closestAlmsivi === closestDivine && closestAlmsivi === current) return null
    return <div>
        <h3>Intervention</h3>
        {closestAlmsivi !== current && <JourneyAddStepButton from={current} step={{method: "almsivi", target: closestAlmsivi.entry.id}} text={"Almsivi Intervention"} /> }
        {closestDivine !== current && <JourneyAddStepButton from={current} step={{method: "divine", target: closestDivine.entry.id}} text={"Divine Intervention"} /> }
    </div>
}

export function TravelJourneyOptions() {
    let {decorated, sceneData} = useTravelJourneyContext()
    if(!decorated) return null
    let current = decorated.destination
    return <div className="flex-row">
        <Intervention current={current} />
        <TravelJourneySimpleOptions current={current} />
        <TravelJourneyMageOptions current={current} />
    </div>
}
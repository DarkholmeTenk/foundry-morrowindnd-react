import {NoteData} from "Systems/Traveller/Data/NoteData";
import {JourneyAddStepButton} from "Systems/Traveller/JourneyBuilder/JourneyStepChooser/JourneyAddStepButton";

function TravelJourneySimpleOption({current, method}: {current: NoteData, method: "boat" | "propylon" | "siltstrider"}) {
    let options = current.travel[method]
    if(!options || options.length === 0) return null
    return <div>
        <h3>{method.capitalize()}</h3>
        <ul>
            {options.map(o=><JourneyAddStepButton from={current} step={{target: o.target, method}} text={""} key={o.target}/>)}
        </ul>
    </div>
}

export function TravelJourneySimpleOptions({current}: {current: NoteData}) {
    return <>
        <TravelJourneySimpleOption current={current} method={"propylon"} />
        <TravelJourneySimpleOption current={current} method={"boat"} />
        <TravelJourneySimpleOption current={current} method={"siltstrider"} />
    </>
}
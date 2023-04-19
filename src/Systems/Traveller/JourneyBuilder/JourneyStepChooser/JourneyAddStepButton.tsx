import {NoteData} from "Systems/Traveller/Data/NoteData";
import {handleStep, TravelJourneyStep} from "Systems/Traveller/JourneyBuilder/TravelJourneyStep";
import {useTravelJourneyContext} from "Systems/Traveller/JourneyBuilder/TravelJourneyBuilder";
import {useArrayAdder} from "Util/Helper/ArrayReducers";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

export function JourneyAddStepButton({step, from, text}: { from: NoteData, step: TravelJourneyStep, text: string }) {
    let {sceneData, setSteps} = useTravelJourneyContext()
    let addStep = useArrayAdder(setSteps)
    let decorated = handleStep(sceneData, from, step)
    if (!decorated) return null
    return <Button onClick={() => addStep(step)}>
        <span>{text} -{">"} {decorated.to.entry.name}</span>
        <div>
            {decorated.price > 0 && <GoldDisplay value={decorated.price}/>}
            {decorated.hours > 0 && <span>{decorated.hours}hours</span>}
        </div>
    </Button>
}
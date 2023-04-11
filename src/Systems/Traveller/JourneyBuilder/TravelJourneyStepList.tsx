import {useTravelJourneyContext} from "Systems/Traveller/JourneyBuilder/TravelJourneyBuilder";
import {NoteData} from "Systems/Traveller/Data/NoteData";
import {TravelJourneyStep} from "Systems/Traveller/JourneyBuilder/TravelJourneyStep";
import Styles from "./JourneyBuilder.module.scss"

function toSpliced<T>(arr: T[], index: number) {
    let c = [...arr]
    c.splice(index)
    return c
}

function getName(sceneData: NoteData[], id: string | NoteData) {
    if(typeof(id) === "object") return id.entry.name
    return sceneData.find(x=>x.entry.id === id)?.entry?.name ?? "UNKNOWN"
}

function TravelJourneyStep({step, index}: {step: TravelJourneyStep, index: number}) {
    let {sceneData, decorated, setSteps} = useTravelJourneyContext()
    let decoratedStep = decorated ? decorated.decoratedSteps[index] : undefined
    let remove = ()=>setSteps(x=>toSpliced(x, index))
    return <div className={`flex-row ${Styles.step}`}>
        <div className="flex-col">
            <div>{step.method} to</div>
            <div>
                <span>{getName(sceneData, decoratedStep?.to ?? step.target)}</span>
            </div>
        </div>
        <div>
            <a className="fa-solid fa-eraser" onClick={remove}></a>
        </div>
    </div>
}

export function TravelJourneyStepList() {
    let {steps} = useTravelJourneyContext()
    return <div className={`flex-row ${Styles.arrowSteps}`}>
        {steps.map((s, i)=><TravelJourneyStep step={s} index={i} key={i} />)}
    </div>
}
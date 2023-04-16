import {NoteData} from "Systems/Traveller/Data/NoteData";
import {getClosestIntervention} from "Systems/Traveller/JourneyBuilder/TravelJourneyUtil";

export type TravelMethod = "almsivi" | "divine" | "direct" | "mages" | "siltstrider" | "boat" | "propylon"
export interface TravelJourneyStep {
    method: TravelMethod
    target: string
}

export interface DecoratedStep {
    from: NoteData
    to: NoteData
    price: number
    hours: number
    step: TravelJourneyStep
}
export interface DecoratedJourney {
    source: NoteData,
    destination: NoteData,
    decoratedSteps: DecoratedStep[]
}

type ThingHandler<T extends TravelMethod> = (type: T, sceneData: NoteData[], from: NoteData, step: TravelJourneyStep)=>DecoratedStep | null
const Things: {[key in TravelMethod]: ThingHandler<key>} = {
    "almsivi": decorateAlmDiv,
    "divine": decorateAlmDiv,
    "direct": handleDirect,
    "mages": handleMages,
    "boat": handleSimple,
    "siltstrider": handleSimple,
    "propylon": handleSimple
}

function decorateAlmDiv(type: "almsivi" | "divine", sceneData: NoteData[], from: NoteData, step: TravelJourneyStep) {
    let destination = step.target
    let closest = getClosestIntervention(type, sceneData, from.note)
    if(closest.entry.id !== destination) return null
    return {from, to: closest, price: 0, hours: 0, step}
}

function handleDirect(type: string, sceneData: NoteData[], from: NoteData, step: TravelJourneyStep) {
    let target = sceneData.find(x=>x.travel.direct && x.entry.id === step.target)
    if(!target) return null
    return {from, to: target, price: 0, hours: 0, step}
}

function handleMages(type: string, sceneData: NoteData[], from: NoteData, step: TravelJourneyStep) {
    if(!from.travel.mages) return null
    let target = sceneData.find(x=>x.travel.mages && x.entry.id === step.target)
    if(!target) return null
    return {from, to: target, price: 100, hours: 0, step}
}

function handleSimple(type: "boat" | "siltstrider" | "propylon", sceneData: NoteData[], from: NoteData, step: TravelJourneyStep) {
    let destinations = from.travel[type] ?? []
    let x = destinations.find(y=>y.target === step.target)
    let z = sceneData.find(y=>y.entry.id === step.target)
    if(!x || !z) return null
    return {from, to: z, step, price: x.cost, hours: x.hours}
}

export function handleStep<T extends TravelMethod>(sceneData: NoteData[], current: NoteData, step: TravelJourneyStep & {method: T}): DecoratedStep | null {
    let mapper = Things[step.method] as ThingHandler<T>
    return mapper(step.method, sceneData, current, step)
}

export function decorateJourney(sceneData: NoteData[], start: NoteData, steps: TravelJourneyStep[]): DecoratedJourney | null {
    let destination = start
    let decoratedSteps: DecoratedStep[] = []
    for(let step of steps) {
        let decorated = handleStep(sceneData, destination, step)
        if(decorated === null) return null
        destination = decorated.to
        decoratedSteps.push(decorated)
    }
    return {
        source: start,
        destination,
        decoratedSteps
    }

}
import {useCanvasToken, useParty} from "Util/Components/SelfActorSelector";
import {getSceneNoteData} from "Systems/Traveller/Data/NoteDataUtil";
import {createContext, useContext, useState} from "react";
import {getDistance} from "Util/Helper/DistanceHelper";
import {NoteData} from "Systems/Traveller/Data/NoteData";
import {DecoratedJourney, decorateJourney, TravelJourneyStep} from "Systems/Traveller/JourneyBuilder/TravelJourneyStep";
import {TravelJourneyOptions} from "Systems/Traveller/JourneyBuilder/JourneyStepChooser/TravelJourneyOptions";
import {useArrayAdder} from "Util/Helper/ArrayReducers";
import {StateSetter} from "Util/React/update/Updater";
import {TravelJourneyStepList} from "Systems/Traveller/JourneyBuilder/TravelJourneyStepList";
import {TravelJourneyDecoratedViewer} from "Systems/Traveller/JourneyBuilder/TravelJourneyDecoratedViewer";

interface CtxData {
    token: TokenDocument,
    sceneData: NoteData[],
    steps: TravelJourneyStep[],
    starting: NoteData,
    setSteps: StateSetter<TravelJourneyStep[]>
    decorated: DecoratedJourney | null
}
const TravelJourneyContext = createContext<CtxData | undefined>(undefined)
export function useTravelJourneyContext(): CtxData {
    return useContext(TravelJourneyContext)!
}

function TravelJourneyBuilderContents({token, sceneData}: {token: TokenDocument, sceneData: NoteData[]}) {
    let [steps, setSteps] = useState<TravelJourneyStep[]>([])
    let addSteps = useArrayAdder(setSteps)
    let starting = sceneData.reduce((a,b)=>getDistance(token, a.note) < getDistance(token, b.note) ? a : b)
    let decorated = decorateJourney(sceneData, starting, steps)
    let ctx: CtxData = {
        token,
        sceneData,
        starting,
        steps,
        setSteps,
        decorated
    }
    if(!decorated) return null
    return <div>
        <TravelJourneyContext.Provider value={ctx} >
            {starting.entry.name} to {decorated.destination.entry.name}
            {decorated && <>
                <hr />
                <TravelJourneyDecoratedViewer />
            </>}
            <hr />
            <TravelJourneyStepList />
            <hr />
            <TravelJourneyOptions />
        </TravelJourneyContext.Provider>
    </div>
}

export function TravelJourneyBuilder() {
    let actor = useParty()
    let token = useCanvasToken(canvas?.scene!, actor)
    let scene = canvas?.scene
    let sceneData = scene ? getSceneNoteData(scene) : undefined
    if(!sceneData || sceneData.length == 0 || !token) return <div>Cannot build journey</div>
    return <div>
        <TravelJourneyBuilderContents token={token} sceneData={sceneData} />
    </div>
}
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
import {useIsGm} from "Util/React/core/GmContext";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {createGroupPayMessage} from "Systems/GroupPay/Message/CreateGroupPayMessage";
import {useCanvasScene} from "Util/Helper/EntityHelper";

interface CtxData {
    token: TokenDocument,
    sceneData: NoteData[],
    steps: TravelJourneyStep[],
    starting: NoteData,
    setSteps: StateSetter<TravelJourneyStep[]>
    decorated: DecoratedJourney | null
}
const TravelJourneyContext = createContext<CtxData>({} as CtxData)
export function useTravelJourneyContext(): CtxData {
    return useContext(TravelJourneyContext)!
}

function TravelJourneyPayButton() {
    let {decorated} = useContext(TravelJourneyContext)
    let isGm = useIsGm()
    if(!isGm || !decorated) return null
    let hours = decorated.decoratedSteps.reduce((p, c)=>p+c.hours, 0)
    let travelStepsStr = decorated.source.entry.name + ", " + decorated.decoratedSteps.map(d=>d.step.method + " to " + d.to.entry.name).join(", ") +". " + hours + "h"
    let price = decorated.decoratedSteps.reduce((p,c)=>p+c.price, 0)
    return <Button onClick={()=>createGroupPayMessage({requester: {type: "dm"}, purpose: "Travel. " + travelStepsStr, amount: price})}>Request Party Money</Button>
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
            <div className="flex-row">
                <span>{starting.entry.name} to {decorated.destination.entry.name}</span>
                <TravelJourneyPayButton />
            </div>
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
    let scene = useCanvasScene()
    let token = useCanvasToken(scene, actor)
    let sceneData = scene ? getSceneNoteData(scene) : undefined
    if(!sceneData || sceneData.length == 0 || !token) return <div>Cannot build journey</div>
    return <div>
        <TravelJourneyBuilderContents token={token} sceneData={sceneData} />
    </div>
}
import {useTravelJourneyContext} from "Systems/Traveller/JourneyBuilder/TravelJourneyBuilder";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {DecoratedJourney} from "Systems/Traveller/JourneyBuilder/TravelJourneyStep";

function TravelJourneyActions({decorated, totalPrice, totalHours}: {decorated: DecoratedJourney, totalPrice: number, totalHours: number}) {
    return <>
    </>
}

export function TravelJourneyDecoratedViewer() {
    let {decorated, token} = useTravelJourneyContext()
    if(!decorated) return null
    let totalPrice = decorated.decoratedSteps.reduce((p,c)=>p+c.price,0)
    let totalHours = decorated.decoratedSteps.reduce((p,c)=>p+c.hours, 0)
    return <div className="flex-row">
        <div>
            <div>
                <span>Total Cost:</span>
                <GoldDisplay value={totalPrice} />
            </div>
            <div>
                <span>Total Time:</span>
                <span>{totalHours} Hours</span>
            </div>
        </div>
        <div>

        </div>
    </div>
}
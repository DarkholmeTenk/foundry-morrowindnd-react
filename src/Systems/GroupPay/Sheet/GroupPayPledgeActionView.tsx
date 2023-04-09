import {getTotalPledged, GroupPayFlag} from "../Model/GroupPayFlag";
import {getPartyUUIDs} from "Settings/token/TokenSettings";
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {PledgeGroupPayAction} from "../socket/PledgeGroupPayAction";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {Button} from "Util/Components/SimpleComponents";
import {getGoldAmountFromActor} from "Util/Helper/GoldHelper";

function CustomPledge({message}) {

}

export function PledgeButton({message, amount, text}: {message: ChatMessage, amount: number, text: string}) {
    let self = useNewSelf()
    if(!self) return null
    let gold = getGoldAmountFromActor(self)
    return <Button disabled={gold < amount} onClick={()=>PledgeGroupPayAction({chatMessageId: message.id, amount, selfId: self!.uuid})}>
        {text} (<GoldDisplay value={amount} />)
    </Button>
}

export function GroupPayPledgeActionView({message, request, paid, pledges}: GroupPayFlag & {message: ChatMessage}) {
    let partyCount = getPartyUUIDs().length
    let pledged = getTotalPledged(pledges)
    let remaining = request.amount - pledged
    if(paid) return null
    return <div>
        Pledge:
        <PledgeButton message={message} amount={remaining} text="Pledge remaining" />
        <PledgeButton message={message} amount={request.amount / partyCount} text="Pledge fair" />
    </div>
}
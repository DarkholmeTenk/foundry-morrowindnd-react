import {getTotalPledged, GroupPayFlag} from "../Model/GroupPayFlag";
import {getPartyUUIDs} from "Settings/token/TokenSettings";
import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {PledgeGroupPayAction} from "../socket/PledgeGroupPayAction";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import {Button} from "Util/Components/SimpleComponents";
import {getGoldAmountFromActor, parseGold} from "Util/Helper/GoldHelper";
import Styles from "./GroupPaySheet.module.scss"
import {useContext, useState} from "react";
import {GroupPayPledgeContext} from "Systems/GroupPay/Sheet/GroupPaySheet";

function CustomPledge() {
    let self = useNewSelf()
    let [amount, setAmount] = useState("0")
    let realAmount = parseGold(amount)

    return <div className={Styles.PledgeView_Custom}>
        <input title="Pledge" type="number" name="amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
        <PledgeButton amount={realAmount} text="Pledge" />
        <div className={Styles.PledgeView_Custom_Available}>
            <label>Available:</label>
            <GoldDisplay actor={self!} />
        </div>
    </div>
}

export function PledgeButton({amount, text}: {amount: number, text: string}) {
    let self = useNewSelf()
    let {message, pledges, request: {amount: requestAmount}} = useContext(GroupPayPledgeContext)
    let remaining = requestAmount - getTotalPledged(pledges)
    let xAmount = Math.min(remaining, amount)
    if(!self) return null
    let gold = getGoldAmountFromActor(self)
    let disabled = isNaN(xAmount) || gold < xAmount || xAmount == 0
    return <Button disabled={disabled} onClick={()=>PledgeGroupPayAction({chatMessageId: message.id, amount: xAmount, selfId: self!.uuid})}>
        {text} (<GoldDisplay value={xAmount} />)
    </Button>
}

export function GroupPayPledgeActionView({request, paid, pledges}: GroupPayFlag & {message: ChatMessage}) {
    let user = useNewSelf()
    if(!user) return <div>Select yourself to pledge!</div>
    let partyCount = getPartyUUIDs().length
    let pledged = getTotalPledged(pledges)
    let remaining = request.amount - pledged
    if(paid) return null
    return <div className={Styles.PledgeView}>
        <CustomPledge />
        <div className={Styles.PledgeView_Defaults}>
            <PledgeButton amount={remaining} text="Pledge remaining" />
            <PledgeButton amount={request.amount / partyCount} text="Pledge fair" />
        </div>
    </div>
}
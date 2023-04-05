import {registerGMSocket} from "Util/Socket/SocketHelper";
import {GroupPayPledge, hasGroupPayFlag, useGroupPayFlag} from "../Model/GroupPayFlag";
import {getGoldAmountFromActor} from "Util/Helper/GoldHelper";
import {loadActor} from "Util/Identifiers/UuidHelper";

interface PledgeGroupPayData {
    chatMessageId: string,
    selfId: string,
    amount: number
}
export const PledgeGroupPayAction = registerGMSocket("GroupPay_Resolve", async ({chatMessageId, selfId, amount}: PledgeGroupPayData)=>{
    let message = game.messages.get(chatMessageId)
    let self = await loadActor(selfId)
    if(!self || !message || !hasGroupPayFlag(message)) return
    let [flag, setFlag] = useGroupPayFlag(message)
    let existing: GroupPayPledge = flag.pledges.find(x=>x.actorId == selfId) ?? {actorId: selfId, amount: 0}
    let selfMaxGold = getGoldAmountFromActor(self)
    let newTotal = Math.min(selfMaxGold, existing.amount + amount)
    let newPledges = flag.pledges.filter(x=>x.actorId !== selfId)
    if(newTotal > 0)
        newPledges.push({actorId: selfId, amount: newTotal})
    await setFlag({...flag, pledges: newPledges})
})
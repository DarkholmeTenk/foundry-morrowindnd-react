import {registerGMSocket} from "Util/Socket/SocketHelper";
import {getTotalPledged, GroupPayFlag, hasGroupPayFlag, useGroupPayFlag} from "../Model/GroupPayFlag";
import {loadActor} from "Util/Identifiers/UuidHelper";
import {addGold, getGoldAmountFromActor, removeGold} from "Util/Helper/GoldHelper";
import {GroupPayRequester, groupPayRequestToMessage} from "../Model/GroupPayRequest";
import {Messages} from "Util/Messages";


interface PayActor {
    found: boolean,
    actor: Actor5e | undefined
}
function getPayActor(requester: GroupPayRequester): PayActor {
    if(requester.type === "actor") {
        let actor = loadActor.sync(requester.actorId)
        return {found: actor !== undefined, actor}
    }
    return {found: true, actor: undefined}
}

interface ResolveGroupPayData {
    chatMessageId: string
}

function checkValidity(flag: GroupPayFlag, messageObj: Messages, payActor: PayActor) {
    let totalAmount = getTotalPledged(flag.pledges)
    let isAmountCorrect = totalAmount === flag.request.amount
    if(!isAmountCorrect) {
        messageObj.addMessage("Pledged:", {type: "gp", value: totalAmount}, "does not match requested", {type: "gp", value: flag.request.amount})
    }
    if (!payActor.found) {
        messageObj.addMessage("Unable to find payment target")
    }
    let canActorsAfford = flag.pledges.every(x => {
        let actor = loadActor.sync(x.actorId)
        messageObj.addMessage(actor ?? x.actorId, "has pledged", {type: "gp", value: x.amount})
        if (!actor) {
            messageObj.addMessage("Cannot find actor:", x.actorId)
            return false
        }
        let gold = getGoldAmountFromActor(actor)
        if (gold >= x.amount)
            return true
        else {
            messageObj.addMessage(actor, "cannot afford pledge, only has", {type: "gp", value: gold})
            return false
        }
    })

    return isAmountCorrect && canActorsAfford && payActor.found;
}

export const ResolveGroupPayAction = registerGMSocket("GroupPay_Resolve", async ({chatMessageId}: ResolveGroupPayData)=>{
    let message = game.messages.get(chatMessageId)
    if(!message || !hasGroupPayFlag(message)) return
    let [flag, setFlag] = useGroupPayFlag(message)
    let messageObj = groupPayRequestToMessage(flag.request)
    messageObj.addBreak()
    let payActor = getPayActor(flag.request.requester)
    let isValid = checkValidity(flag, messageObj, payActor);
    messageObj.addBreak()
    if(!isValid) {
        messageObj.addMessage("Payment incomplete")
    } else {
        await flag.pledges.forEachAsync(async (x)=>{
            let actor = loadActor.sync(x.actorId)
            if(!actor) return
            await removeGold(actor, x.amount)
        })
        if(payActor.actor) {
            await addGold(payActor.actor, flag.request.amount)
        }
        messageObj.addMessage("Paid!")
        await setFlag({...flag, paid: true})
    }
    await messageObj.update(message)
})
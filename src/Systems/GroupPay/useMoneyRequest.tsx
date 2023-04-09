import {useNewSelf} from "Util/React/core/NewSelfSelector";
import {GroupPayRequester} from "Systems/GroupPay/Model/GroupPayRequest";
import {useIsGm} from "Util/React/core/GmContext";
import {createGroupPayMessage} from "Systems/GroupPay/Message/CreateGroupPayMessage";

interface MoneyRequestResult {
    canRequestMoney: boolean,
    requestMoney: (amount: number, purpose: string)=>Promise<void>
}
export function useMoneyRequest(): MoneyRequestResult {
    let self = useNewSelf()
    let isGm = useIsGm()
    if(!self && !isGm) return {canRequestMoney: false, requestMoney: async ()=>{}}
    let requester: GroupPayRequester = self ? {type: "actor", actorId: self.uuid} : {type: "dm"}
    return {
        canRequestMoney: true,
        requestMoney: async (amount, purpose)=>{
            await createGroupPayMessage({requester, amount, purpose})
        }
    }
}
import {GroupPayFlag, useGroupPayFlag} from "../Model/GroupPayFlag";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {GroupPayRequestView} from "./GroupPayRequestView";
import {GroupPayPledgeView} from "./GroupPayPledgeView";
import {GroupPayPledgeActionView} from "./GroupPayPledgeActionView";
import {createContext} from "react";
import {GroupPayRequest} from "Systems/GroupPay/Model/GroupPayRequest";

interface Ctx extends GroupPayFlag {
    message: ChatMessage
}
export const GroupPayPledgeContext = createContext<Ctx>(null as unknown as Ctx)

export function GroupPaySheet({message}: {message: ChatMessage}) {
    useWatchEntity(message)
    let [flag] = useGroupPayFlag(message)
    if(!flag) return <div>Error!</div>
    let {paid, request, pledges} = flag
    return <div>
        <GroupPayPledgeContext.Provider value={{message, ...flag}}>
            <GroupPayRequestView request={request} />
            <hr />
            {flag.paid ? null : <GroupPayPledgeActionView request={request} pledges={pledges} paid={paid} message={message} />}
            <hr />
            <GroupPayPledgeView pledges={pledges} message={message} amount={request.amount} paid={paid} />
        </GroupPayPledgeContext.Provider>
    </div>
}
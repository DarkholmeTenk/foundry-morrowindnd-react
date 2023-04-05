import {useGroupPayFlag} from "../Model/GroupPayFlag";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {GroupPayRequestView} from "./GroupPayRequestView";
import {GroupPayPledgeView} from "./GroupPayPledgeView";
import {GroupPayPledgeActionView} from "./GroupPayPledgeActionView";

export function GroupPaySheet({message}: {message: ChatMessage}) {
    useWatchEntity(message)
    let [flag] = useGroupPayFlag(message)
    if(!flag) return <div>Error!</div>
    let {paid, request, pledges} = flag
    return <div>
        <GroupPayRequestView request={request} />
        {flag.paid ? null : <GroupPayPledgeActionView request={request} pledges={pledges} paid={paid} message={message} />}
        <GroupPayPledgeView pledges={pledges} message={message} amount={request.amount} paid={paid} />
    </div>
}
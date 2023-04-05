import {GroupPayRequest} from "../Model/GroupPayRequest";
import {GroupPayRequesterView} from "./GroupPayRequesterView";
import GoldDisplay from "../../../Util/Components/GoldDisplay";

export function GroupPayRequestView({request}: {request: GroupPayRequest}) {
    return <div>
        <div><GroupPayRequesterView requester={request.requester} /></div>
        <div>
            <span>Is Requesting</span>
            <GoldDisplay value={request.amount} />
        </div>
        <div>
            <span>For:</span>
            <span>{request.purpose}</span>
        </div>
    </div>
}
import {GroupPayRequester} from "../Model/GroupPayRequest";
import {loadActor} from "Util/Identifiers/UuidHelper";
import ItemViewer from "../../../Util/Components/ItemViewer/ItemViewer";

export function GroupPayRequesterView({requester}: {requester: GroupPayRequester}) {
    if(requester.type === "dm") {
        if(requester.label) return <span>{requester.label}</span>
        return <span>DM</span>
    } else {
        let actor = loadActor.sync(requester.actorId)
        if(actor)
            return <ItemViewer item={actor} />
        else
            return <span>Unknown</span>
    }
}
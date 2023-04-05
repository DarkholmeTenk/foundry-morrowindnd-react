import {MessagePart, Messages} from "Util/Messages";
import {loadActor} from "Util/Identifiers/UuidHelper";

interface GroupPayDMRequester {
    type: "dm",
    label?: string
}

interface GroupPayActorRequester {
    type: "actor"
    actorId: UUID
}

export type GroupPayRequester = GroupPayActorRequester | GroupPayDMRequester
export interface GroupPayRequest {
    requester: GroupPayRequester
    amount: number
    purpose: string
}

export function groupPayRequestToMessage({requester, amount, purpose}: GroupPayRequest): Messages {
    let messages = new Messages()
    let parts: MessagePart[] = []
    if(requester.type === "dm") {
        if(requester.label)
            parts.push(requester.label, "is requesting the party pays")
        else
            parts.push("The party is requested to pay")
    } else {
        parts.push(loadActor.sync(requester.actorId) ?? "Unknown", "is requesting the party pays")
    }
    parts.push({type: "gp", value: amount}, "for", purpose)
    messages.addMessage(...parts)
    return messages
}
import {GroupPayRequest, groupPayRequestToMessage} from "../Model/GroupPayRequest";
import {getGroupPayFlagData} from "../Model/GroupPayFlag";

export async function createGroupPayMessage(request: GroupPayRequest) {
    let message = await (groupPayRequestToMessage(request)).getFinalMessage()
    await ChatMessage.create({
        content: message,
        ...getGroupPayFlagData(request)
    })
}
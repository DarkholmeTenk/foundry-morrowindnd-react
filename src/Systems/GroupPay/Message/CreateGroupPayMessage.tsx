import {GroupPayRequest, groupPayRequestToMessage} from "../Model/GroupPayRequest";
import {getGroupPayFlagData} from "../Model/GroupPayFlag";
import {OpenGroupPayAction} from "Systems/GroupPay/socket/OpenGroupPayAction";

interface Options {
    openSheet?: boolean
}
export async function createGroupPayMessage(request: GroupPayRequest, options?: Options) {
    let openSheet = options?.openSheet ?? true
    let message = await (groupPayRequestToMessage(request)).getFinalMessage()
    let messageObj = await ChatMessage.create({
        content: message,
        ...getGroupPayFlagData(request)
    })
    if(openSheet) {
        OpenGroupPayAction({chatMessageId: messageObj.id})
    }
}
import {registerSocket} from "Util/Socket/SocketHelper";
import {openGroupPay} from "../Sheet/GroupPayApplication";

interface OpenGroupPayData {
    chatMessageId: string
}
export const OpenGroupPayAction = registerSocket("GroupPay_OpenPlayer", async ({chatMessageId}: OpenGroupPayData)=>{
    openGroupPay(chatMessageId)
})
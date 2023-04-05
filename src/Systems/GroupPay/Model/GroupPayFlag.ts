import {GroupPayRequest} from "./GroupPayRequest";
import getFlag, {FLAG_SCOPE} from "../../../Util/Helper/FlagHelper";

const GroupPayFlagKey = "GroupPay"

export interface GroupPayPledge {
    actorId: UUID,
    amount: number
}

export interface GroupPayFlag {
    request: GroupPayRequest
    pledges: GroupPayPledge[]
    paid: boolean
}

export function hasGroupPayFlag(message: ChatMessage) {
    return message.getFlag(FLAG_SCOPE, GroupPayFlagKey) !== undefined
}

export function useGroupPayFlag(message: ChatMessage) {
    return getFlag<GroupPayFlag>(message, GroupPayFlagKey)
}

export function getGroupPayFlagData(request: GroupPayRequest) {
    let flag: GroupPayFlag = {
        request,
        pledges: [],
        paid: false
    }
    return {
        flags: {
            [FLAG_SCOPE]: {
                [GroupPayFlagKey]: flag
            }
        }
    }
}

export function getTotalPledged(pledged: GroupPayPledge[]): number {
    if(!pledged) return 0
    return pledged.reduce((p, c)=>p + c.amount, 0)
}
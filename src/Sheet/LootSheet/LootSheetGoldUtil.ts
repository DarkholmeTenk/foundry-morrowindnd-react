import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";
import {getActivePlayerUsers} from "../../Util/Helper/UserHelper";
import {getLootFlag} from "./LootFlags";

export function getGoldDetails(npc: Actor5e) {
    let amount = getGoldAmountFromActor(npc)
    let [flag] = getLootFlag(npc)

    let users = getActivePlayerUsers()
    let takers: {[id: string]: boolean} = {}
    users.forEach(x=>takers[x.id!] = flag.goldTakers[x.id!] === true)
    let takeCount = users.filter(x=>takers[x.id!]).length
    let splitAmount = amount  /  (takeCount || 1)
    return {users, takers, amount, splitAmount, takeCount}
}
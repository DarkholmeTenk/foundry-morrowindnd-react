import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";

export function useLootSheetFlag(npc) {
    let data = {
        goldTakers: {}
    }
    let x = npc.token || npc
    Object.assign(data, x.getFlag("morrowindnd", "lootsheet"))
    return {flag: data, setFlag: (newFlag)=>x.setFlag("morrowindnd", "lootsheet", newFlag)}
}

export function getGoldDetails(npc) {
    let amount = getGoldAmountFromActor(npc.data.data.currency)
    let {flag} = useLootSheetFlag(npc)

    let users = game.users.entities.filter(u=>!u.isGM && u.active)
    let takers: {[id: string]: boolean} = {}
    users.forEach(x=>takers[x.id] = flag.goldTakers[x.id] === true)
    let takeCount = users.filter(x=>takers[x.id]).length
    let splitAmount = amount  /  (takeCount || 1)
    return {users, takers, amount, splitAmount, takeCount}
}
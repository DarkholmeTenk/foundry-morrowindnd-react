import {registerGMSocket} from "../../../Util/Socket/SocketHelper";
import {loadActor} from "../../../Util/Identifiers/UuidHelper";
import {getLootGoldDetails} from "../LootFlags";
import {getGoldBreakdown, NoActorCurrency} from "../../../Util/Helper/GoldHelper";
import {CurrencyItem} from "../../../RollTable/Rolling/TableGoldHelper";

interface LootSplitGoldAction {
    lootId: UUID
}

export const LootSplitGold = registerGMSocket<LootSplitGoldAction>("LootSheet_SplitGold", async ({lootId}) => {
    let actor = loadActor.sync(lootId)!
    let {takers, splitAmount} = getLootGoldDetails(actor)
    let breakdown = getGoldBreakdown(splitAmount)
    let count = 0
    for (let key of Object.keys(takers)) {
        let user = game.users!.get(key)
        if (takers[key] && user && user.character) {
            let item = new CurrencyItem(breakdown)
            let modifier = item.getModifications(user.character._source)
            await user.character.update(modifier)
            count++
        }
    }
    if (count > 0) {
        await actor.update({"system.currency": NoActorCurrency})
    }
})
import {registerGMSocket} from "Util/Socket/SocketHelper";
import {loadActor} from "Util/Identifiers/UuidHelper";
import {getLootGoldDetails} from "../LootFlags";
import {getGoldBreakdown, NoActorCurrency} from "Util/Helper/GoldHelper";
import {CurrencyItem} from "RollTable/Rolling/TableGoldHelper";
import {Messages} from "Util/Messages";

interface LootSplitGoldAction {
    lootId: UUID
}

export const LootSplitGold = registerGMSocket<LootSplitGoldAction>("LootSheet_SplitGold", async ({lootId}) => {
    let actor = loadActor.sync(lootId)!
    let {takers, splitAmount} = getLootGoldDetails(actor)
    let breakdown = getGoldBreakdown(splitAmount)
    let count = 0
    let messages = new Messages()
    await takers.forEachAsync(async (uuid)=>{
        let character = await loadActor(uuid)
        if(!character) return
        let item = new CurrencyItem(breakdown)
        let modifier = item.getModifications(character._source)
        await character.update(modifier)
        messages.addMessage(character, "has looted", {type: "gp", value: splitAmount})
        count++
    })
    if (count > 0) {
        await actor.update({"system.currency": NoActorCurrency})
        await messages.send()
    }
})
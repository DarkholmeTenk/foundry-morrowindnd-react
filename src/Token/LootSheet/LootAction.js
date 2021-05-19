import { registerGMSocket } from "../../Socket/SocketHelper";
import { getActor } from "../../Util/Identifiers/ActorID";
import { getGoldDetails } from "./LootSheetGoldUtil";
import { getGoldBreakdown, NoActorCurrency } from "../../Util/Helper/GoldHelper";
import { CurrencyItem } from "../../RollTable/Rolling/TableGoldHelper";
import { addItem, removeItem } from "../../Util/Helper/ItemTransferHelper";
export const LootTakeSocket = registerGMSocket("LootSheet_Take", async ({ selfId, lootId, qty }) => {
    let itemData = await removeItem(lootId, qty);
    await addItem(itemData, selfId, qty);
});
export const LootSplitGold = registerGMSocket("LootSheet_SplitGold", async ({ lootId }) => {
    let actor = getActor(lootId);
    let { takers, splitAmount } = getGoldDetails(actor);
    let breakdown = getGoldBreakdown(splitAmount);
    let count = 0;
    for (let key of Object.keys(takers)) {
        let user = game.users.get(key);
        if (takers[key] && user && user.character) {
            let item = new CurrencyItem(breakdown);
            let modifier = item.getModifications(user.character.data);
            await user.character.update(modifier);
            count++;
        }
    }
    if (count > 0) {
        await actor.update({ "data.currency": NoActorCurrency });
    }
});

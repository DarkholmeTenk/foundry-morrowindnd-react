import doRollTable from "../../RollTable/Rolling/TableRoller";
import getLogger from "../../Util/LoggerFactory";
const log = getLogger("TokenLootGenerator");
export const ACTOR_FLAG = "extraActorData";
Hooks.on("createTokenMutate", async (update, { actor, token }) => {
    update(async () => {
        let rollTableIds = actor.getFlag("morrowindnd", ACTOR_FLAG)?.rollTableIds || [];
        let rollResult = (await Promise.all(rollTableIds.map(async ({ id: rollTableId, qty }) => {
            let result = new Roll(qty).roll().total;
            let data = await Promise.all(Array(result).fill("").map(() => doRollTable(rollTableId)));
            let flatData = data.flatMap(i => i);
            log.debug("Items rolled", flatData, result);
            return flatData;
        }))).flatMap(i => i);
        let items = rollResult.flatMap(d => d.getItemData()).map(x => new Item(x, null));
        let modifications = {};
        rollResult.map(x => x.getModifications(actor.data)).forEach(modObj => Object.assign(modifications, modObj));
        log("Giving NPC items", token, items, modifications);
        return { "items": items, ...modifications };
    });
});

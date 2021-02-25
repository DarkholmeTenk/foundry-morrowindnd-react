import { getRollTableData } from "./TableHelper";
import "@darkholme/foundry-react-core/src/Util/AsyncHelper";
import getLogger from "../../Util/LoggerFactory";
const log = getLogger("TableRoller");
class EncapsulatingRollData {
    constructor(rolls, modifiers) {
        this.rolls = rolls;
        this.modifiers = modifiers;
    }
    applyItemModification(itemData) {
        return this.rolls.reduce((acc, value) => value.applyItemModification(acc), itemData);
    }
    getItemData() {
        return this.rolls.flatMap(r => r.getItemData())
            .map(itemData => {
            let mods = this.modifiers || [];
            return mods.reduce((acc, value) => value.applyItemModification(acc), itemData);
        });
    }
    getModifications(actorData) {
        let map = {};
        this.rolls.forEach(r => {
            let mods = r.getModifications(actorData);
            Object.assign(map, mods);
        });
        return map;
    }
}
export default async function doRollTable(id) {
    if (!id)
        return;
    let rollTable = game.tables.get(id);
    let { tableId } = (rollTable.getFlag("morrowindnd", "enchant_spells") || {});
    let roll = rollTable.roll();
    let results = (await Promise.all(roll.results.map(async (result) => {
        return await getRollTableData(result);
    }))).flatMap(i => i);
    log("Got results", results);
    let modifiers = await doRollTable(tableId);
    log("Got modifiers", modifiers);
    if (modifiers) {
        return [new EncapsulatingRollData(results, modifiers)];
    }
    else {
        return results;
    }
}

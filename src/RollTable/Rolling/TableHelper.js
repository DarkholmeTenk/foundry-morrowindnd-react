import LoggerFactory from "../../Util/LoggerFactory";
import TableSpellHelper from "./TableSpellHelper";
import TableGoldHelper from "./TableGoldHelper";
import { parseArguments } from "./tableHelperUtils";
import TableItemHelper from "./TableItemHelper";
import TableWeaponEnchantHelper from "./TableWeaponEnchantHelper";
import TableItemRollData from "./TableItemRollData";
import TableTableHelper from "./TableTableHelper";
const log = LoggerFactory("TableHelper");
const TextHelpers = {
    "@Gold": new TableGoldHelper(),
    "@Item": new TableItemHelper(),
    "@Spells": new TableSpellHelper(),
    "@Table": new TableTableHelper(),
    "@WeaponEnchant": new TableWeaponEnchantHelper()
};
function getArguments(text) {
    let results = text.match(/\[([^\]]+)\]/g)?.map(text => text.substr(1, text.length - 2)) || [];
    log.debug("Found roll helper arguments", results, text);
    return parseArguments(results);
}
export async function getRollTableData({ type, text, resultId, collection }) {
    log.debug("Getting roll item", arguments);
    if (type == 0) {
        let call = text.split(/\s/, 1);
        let helper = TextHelpers[call];
        if (helper) {
            let filters = getArguments(text);
            let result = await helper.getRollData(filters);
            log.debug("Found result", result);
            return result;
        }
        else {
            return [];
        }
    }
    else if (type == 1) {
        return [new TableItemRollData(game.items.get(resultId))];
    }
    else if (type == 2) {
        let pack = game.packs.get(collection);
        return [new TableItemRollData(await pack.getEntity(resultId))];
    }
    else {
        log.error("Somehow we got the wrong type", arguments);
    }
}

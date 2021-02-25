import doRollTable from "./TableRoller";
async function nAsync(number, generator) {
    let array = Array(number).fill(" ");
    return await Promise.all(array.map(async () => await generator()));
}
export default class TableTableHelper {
    async getRollData({ args, filterItem }) {
        if (!args.table) {
            throw Error("No @table argument specified");
        }
        else {
            let table = game.tables.find(t => t.name === args.table);
            if (!table) {
                throw Error(`No table found for name [${args.table}]`);
            }
            else {
                let min = parseInt(args.min || "0");
                let results = [];
                if (min) {
                    let i = 0;
                    while (results.length < min && i < 20) {
                        let items = (await doRollTable(table.id)).flatMap(i => i.getItemData()).filter(filterItem);
                        if (items.length > 0) {
                            results.push(...items);
                        }
                        i++;
                    }
                }
                else {
                    let rollString = args.roll || "1";
                    let rollResult = new Roll(rollString).roll().total;
                    let resultTables = await nAsync(rollResult, () => doRollTable(table.id));
                    results = resultTables
                        .flatMap(i => i)
                        .flatMap(i => i)
                        .filter(filterItem);
                }
                let max = parseInt(args.max || "100");
                return results.slice(0, max);
            }
        }
    }
}

import { CurrencyType, getActorDataCurrencyAmount } from "../../Util/Helper/GoldHelper";
const CurrencyLevels = [CurrencyType.pp, CurrencyType.gp, CurrencyType.sp, CurrencyType.cp];
const defaultLevel = "gp";
export class CurrencyItem {
    constructor(values) {
        this.values = values;
    }
    map(fun) {
        let resultObj = {};
        CurrencyLevels.forEach(level => {
            let existing = this.values[level] || 0;
            let result = fun(existing, level);
            resultObj[level] = result;
        });
        return resultObj;
    }
    multiply(amount) {
        return new CurrencyItem(this.map(v => v * amount));
    }
    add(other) {
        let ov = other.values;
        return new CurrencyItem(this.map((v, i) => v + ov[i]));
    }
    isEmpty() {
        return !CurrencyLevels.some(level => {
            return this.values[level];
        });
    }
    getModifications(actorData) {
        let modifications = {};
        let currency = actorData?.data?.currency || {};
        this.map((value, type) => {
            if (!value)
                return;
            let existingValue = getActorDataCurrencyAmount(currency[type]) || 0;
            let modString = `data.currency.${type}`;
            modifications[modString] = existingValue + value;
        });
        return modifications;
    }
    getItemData() {
        return [];
    }
    applyItemModification(itemData) { return itemData; }
    toString() {
        return `CurrencyItem ${JSON.stringify(this.values)}`;
    }
}
export default class TableGoldHelper {
    async getRollData({ args }) {
        let values = {};
        if (args.roll) {
            values[defaultLevel] = args.roll;
        }
        CurrencyLevels.forEach(level => {
            if (args[level]) {
                values[level] = args[level];
            }
        });
        for (let key in values) {
            let roll = values[key];
            let result = parseInt(new Roll(roll).roll().total);
            values[key] = result;
        }
        return [new CurrencyItem(values)];
    }
}

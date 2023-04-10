import {CurrencyItem} from "Systems/RollTable/Rolling/TableGoldHelper";

export enum CurrencyType {
    pp = "pp",
    gp = "gp",
    sp = "sp",
    cp = "cp"
}

export const NoActorCurrency = {
    [CurrencyType.pp]: 0,
    [CurrencyType.gp]: 0,
    [CurrencyType.sp]: 0,
    [CurrencyType.cp]: 0,
}

interface Rate {name: CurrencyType, m: number}
export const CurrencyLevels = [CurrencyType.pp, CurrencyType.gp, CurrencyType.sp, CurrencyType.cp]
export const CurrencyRatesMap: {[t in CurrencyType]: Rate} = {
    cp: {name: CurrencyType.cp, m: 0.01},
    sp: {name: CurrencyType.sp, m: 0.1},
    gp: {name: CurrencyType.gp, m: 1},
    pp: {name: CurrencyType.pp, m: 10}
}
export const CurrencyRates: Rate[] = CurrencyLevels.map(x=>CurrencyRatesMap[x])

export type GoldBreakdown = Partial<Record<CurrencyType, number>>

export function getGoldBreakdown(amount: number): GoldBreakdown {
    let breakdown = {}
    let remaining = amount
    CurrencyRates.forEach(({name, m})=>{
        let c = Math.floor(remaining / m)
        remaining -= c * m
        if(c !== 0) {
            breakdown[name] = c
        }
    })
    return breakdown
}

export function getGoldAmount(breakdown: GoldBreakdown): number {
    return CurrencyRates.reduce((acc, {m, name})=>acc + ((breakdown[name] ?? 0) * m), 0)
}

export function getGoldString(value: number): string {
    let prefix = ""
    if(value < 0) {
        prefix = "-"
        value = -value
    }
    let breakdown = getGoldBreakdown(value)
    return prefix + CurrencyRates.filter(x=>breakdown[x.name]).map(({name})=>{
        return breakdown[name] + name
    }).join(".")
}

export function getActorDataCurrencyAmount(x: any): number {
    if(typeof(x) === "number") {
        return x
    } else {
        return x?.value
    }
}

export function getGoldAmountFromActor(actor: Actor5e): number {
    let data = actor.system.currency
    return CurrencyRates.reduce((acc, {m, name})=>acc + ((getActorDataCurrencyAmount(data[name]) || 0) * m), 0)
}

export async function removeGold(actor: Actor, amount: number) {
    let currency = actor.system.currency
    let remaining = amount
    let newAmounts = {}
    CurrencyRates.forEach(({name, m})=>{
        let coins = getActorDataCurrencyAmount(currency[name])
        let needed = Math.ceil(remaining / m)
        let canTake = Math.min(coins, needed)
        if(canTake != 0) {
            newAmounts[`system.currency.${name}`] = coins - canTake
            remaining -= (canTake * m)
        }
    })
    await actor.update(newAmounts)
}

export async function addGold(actor: Actor, amount: number) {
    let breakdown = getGoldBreakdown(amount)
    let currency = new CurrencyItem(breakdown)
    let mod = currency.getModifications(actor._source)
    await actor.update(mod)
}

export function getGoldValue(price: {value: number, denomination: CurrencyDenomination } | undefined): number {
    if(!price) return 0
    let {value, denomination} = price
    let v = CurrencyRates.find(x=>x.name == denomination)
    if(!v) return 0
    return v.m * value
}

export function getGoldValueFromItemData(data: SmartItemData): number {
    if("price" in data.system)
        return getGoldValue(data.system.price)
    return 0
}

const CopperRate = CurrencyRatesMap[CurrencyType.cp]
export function parseGold(amount: string | number): number {
    let numValue = typeof amount === "string" ? parseFloat(amount) : amount
    if(isNaN(numValue)) return numValue
    let copperAmount = Math.floor(numValue / CopperRate.m)
    return copperAmount * CopperRate.m
}
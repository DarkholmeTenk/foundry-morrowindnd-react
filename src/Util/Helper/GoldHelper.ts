import {CurrencyItem} from "../../RollTable/Rolling/TableGoldHelper";

export enum CurrencyType {
    pp = "pp",
    gp = "gp",
    sp = "sp",
    cp = "cp"
}

export const NoActorCurrency = {
    [CurrencyType.pp]: {value: 0},
    [CurrencyType.gp]: {value: 0},
    [CurrencyType.sp]: {value: 0},
    [CurrencyType.cp]: {value: 0},
}

export const CurrencyRates = [
    {name: CurrencyType.pp, m: 10},
    {name: CurrencyType.gp, m: 1},
    {name: CurrencyType.sp, m: 0.1},
    {name: CurrencyType.cp, m: 0.01}
]

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

export function getActorDataCurrencyAmount(x: any): number {
    if(typeof(x) === "number") {
        return x
    } else {
        return x?.value
    }
}

export function getGoldAmountFromActor(actor: Actor5e): number {
    //TODO: FIX GOLD GET
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
            newAmounts[`data.currency.${name}`] = coins - canTake
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
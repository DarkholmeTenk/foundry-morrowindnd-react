import { getSlotCost } from "./slot-costs"
import {getMagicka, MagickaFlag, MagickaFlagKey} from "../MagickaFlag";
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";

function calculateChange(entity: Actor5e, update: any) {
    let original = entity.system.spells
    let spells = update?.system?.spells ?? {}
    let change = 0
    for (let i = 1; i <= 9; i++) {
        let spellData = spells["spell" + i]
        let originalSpellData = original["spell" + i]
        if(spellData && originalSpellData && "value" in spellData) {
            change += (spellData.value - originalSpellData.value) * getSlotCost(i)
        }
    }
    return change
}

function getMagickaFromUpdate(update: any): Partial<MagickaFlag> | undefined {
    let flags = update?.flags || {}
    let x = flags[FLAG_SCOPE] ?? {}
    if(x[MagickaFlagKey]) return x[MagickaFlagKey]
    return undefined
}

export function fixSpellSlots(magickaVal: number, magickaMax: number, entity: Actor5e): any {
    let base = getMagicka(entity)
    let update = {_id: entity.id}
    let spells = entity.system.spells
    for (let i = 1; i <= 9; i++) {
        let spellData = spells["spell"+i] ?? {current: 0, max: 0}
        let cost = getSlotCost(i);
        let slotVal = Math.floor(magickaVal / cost)
        let slotMax = Math.floor(magickaMax / cost)
        if(slotVal != spellData.value) update[`system.spells.spell${i}.value`] = slotVal
        if(slotMax != (spellData.override ?? spellData.max)) update[`system.spells.spell${i}.override`] = slotMax
    }
    if(base.current !== magickaVal || base.max !== magickaMax) {
        update[`flags.${FLAG_SCOPE}.${MagickaFlagKey}`] = {current: magickaVal, max: magickaMax}
    }
    return update
}

function getMagickaWithUpdate(entity: Actor5e, update: any): MagickaFlag {
    let data = {...getMagicka(entity)}
    let fromUpdate = getMagickaFromUpdate(update)
    if(fromUpdate) {
        let {current, max} = fromUpdate
        let newMax = max ?? data.max
        let newVal = current ?? data.current
        data.current = newVal
        data.max = newMax
    }
    if(update?.system?.spells) {
        let s1 = update.system.spells.spell1 || {}
        if("max" in s1 || "override" in s1) {
            data.max = s1.override ?? s1.max
        }
        if("value" in s1) {
            data.current = s1.value
        } else {
            let change = calculateChange(entity, update)
            data.current = Math.max(Math.min(data.current + change, data.max), 0)
        }
    }
    return data
}

export async function wrapUpdateToken(token, update) {
    await wrapUpdateActor(token.actor, update.actorData)
}

export async function wrapUpdateActor(entity: Actor5e, update) {
    if(update?.system?.spells || getMagickaFromUpdate(update)) {
        let magicka = getMagickaWithUpdate(entity, update)
        let newUpdate = fixSpellSlots(magicka.current, magicka.max, entity)
        mergeObject(update, newUpdate)
    }
}
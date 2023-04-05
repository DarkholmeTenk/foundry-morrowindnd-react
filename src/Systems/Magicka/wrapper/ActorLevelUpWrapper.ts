import {FLAG_SCOPE} from "Util/Helper/FlagHelper";
import {getMagicka, setMagicka} from "../MagickaFlag";
import {getSlotCost} from "./slot-costs";

const EmptyRec: ActorSpells = {value: 0, max: 0}
const SlotTypes = ["pact", "spell0", "spell1", "spell2", "spell3", "spell4", "spell5", "spell6", "spell7", "spell8", "spell9"]
const EmptySlots: Record<string, ActorSpells> = {}
SlotTypes.forEach(v=>EmptySlots[v]=EmptyRec)

function hasWombburn(actor: Actor5e): boolean {
    let x = actor.items.find((e)=>e.name.toLowerCase().replaceAll("-","") == "wombburn")
    return x !== null && x !== undefined
}

function prepareSpellSlots(wrapped: Function, spells: Record<string, ActorSpells>, actor: Actor5e, progression: any) {
    if(actor.type === "npc" || actor.id === undefined) {
        wrapped(spells, actor, progression)
        return
    }
    let newSpells = deepClone(EmptySlots)
    wrapped(newSpells, actor, progression)
    let wb = hasWombburn(actor)
    let flag = getMagicka(actor)
    let {current, max: oldMax} = flag
    let max = 0
    for (let i = 1; i <= 9; i++) {
        let m = newSpells["spell" + i].max
        max += (m * i)
    }
    if(wb) max = Math.floor(max * 1.5)
    if(max === oldMax) return
    for (let i = 1; i <= 9; i++) {
        let r = spells["spell" + i]
        let cost = getSlotCost(i)
        r.max = Math.floor(max / cost)
        r.override = r.max
        r.value = Math.floor(current / cost)
    }
    setMagicka(actor, {current: Math.min(current, max), max}).then(()=>{
        console.log("Updated magicka!", actor.name, oldMax, max)
    })
}

export function wrapPrepareSpellSlots() {
    libWrapper.register(FLAG_SCOPE, "dnd5e.documents.Actor5e.prepareLeveledSlots", prepareSpellSlots)
}
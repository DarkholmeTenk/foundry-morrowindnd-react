import {SpellClassData} from "../../Data/SpellData";
import {SpellSchools} from "../../Util/Components/ItemTable/ItemTypes";
import {getClasses} from "../../Data/ActorData";

interface Settings {
    BaseCosts: Record<number, number>
    NotClassPenalty: Record<number, number>
    SpecBonus: Record<number, number>
    NoSpecBonus: Record<number, number>
}
const SETTINGS: Settings = {
    BaseCosts: {
        1: 30,
        2: 80,
        3: 300,
        4: 1000,
        5: 2000,
        6: 3000,
        7: 5000,
        8: 7500,
        9: 12000
    },
    NotClassPenalty: {
        1: 2,
        2: 2.25,
        3: 2.5,
        4: 2.75,
        5: 3,
        6: 3.5,
        7: 4,
        8: 4.5,
        9: 5
    },
    SpecBonus: {
        1: 0.5,
        2: 0.6,
        3: 0.65,
        4: 0.7,
        5: 0.75,
        6: 0.8,
        7: 0.85,
        8: 0.9,
        9: 0.9
    },
    NoSpecBonus: {
        1: 0.75,
        2: 0.8,
        3: 0.825,
        4: 0.85,
        5: 0.875,
        6: 0.9,
        7: 0.925,
        8: 0.95,
        9: 0.95
    }
}

function hasSchool(matchClass: Boolean, actor: Actor, spell: Item): Boolean {
    if(!matchClass) return false
    let schoolData = SpellSchools[spell.spell().school]
    if(schoolData) {
        return actor.items.find(x=>x.type === "class" && x.clz().subclass.toLowerCase().includes(schoolData.name.toLowerCase())) != null
    } else {
        return false
    }
}

function elq(a: string, b: string): Boolean {
    return a.toLowerCase() == b.toLowerCase()
}

export interface SpellMatches {
    matchClass: Boolean,
    matchSchool: Boolean,
    matchSubClass: Boolean
}
export function getMatches(actor: Actor, spell: Item, spellData: SpellClassData): SpellMatches {
    let actorClasses = getClasses(actor)
    let matchClass = spellData.classes.some(x=>actorClasses.map[x.name.toLowerCase()])
    let matchSchool = hasSchool(matchClass, actor, spell)
    let matchSubClass = spellData.subclasses.some(x=>(actorClasses.map[x.class.name.toLowerCase()]?.subclass?.toLowerCase() || "").includes(x.subclass.name.toLowerCase()))
    return {matchClass, matchSchool, matchSubClass}
}

export function calculateSpellCostFromMatches(spell: Item, matches: SpellMatches): number | null {
    let l = spell.spell().level
    let baseCost = SETTINGS.BaseCosts[l]
    if(!baseCost) return null
    let {matchClass, matchSchool, matchSubClass} = matches
    return baseCost * (matchClass ? 1 : SETTINGS.NotClassPenalty[l]) * ((matchSchool || matchSubClass) ? SETTINGS.SpecBonus[l] : 1)
}


export function calculateSpellCost(actor: Actor, spell: Item, spellData: SpellClassData): number | null {
    let matches = getMatches(actor, spell, spellData)
    return calculateSpellCostFromMatches(spell, matches)
}
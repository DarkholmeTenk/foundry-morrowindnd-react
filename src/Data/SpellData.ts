import LogFactory from "../Util/Logging";

const log = LogFactory("SpellData")

export interface SpellClass {
    name: string,
    source: string
}
export interface SpellSubClass {
    class: SpellClass,
    subclass: SpellClass
}
export interface SpellClassData {
    classes: SpellClass[]
    subclasses: SpellSubClass[]
}

interface FiveEToolsSpellData {
    spell: {
        name: string
        classes?: {
            fromClassList?: SpellClass[]
            fromSubclass?: SpellSubClass[]
        }
    }[]
}

const FiveESources = ["ai", "egw", "ggr", "idrotf", "llk", "phb", "tce", "xge"]
const Data: Record<string, Promise<FiveEToolsSpellData>> = {}

export async function getSpellClasses(spell: Item5e): Promise<SpellClassData | null> {
    let source = spell.data.data.source?.toLowerCase() || ""
    if(FiveESources.includes(source)) {
        if(!Data[source]) {
            log("Fetching spell data", source)
            Data[source] = window.fetch(`https://5e.tools/data/spells/spells-${source}.json`).then(r=>r.json())
        }
        let spells = await Data[source]
        let spellData = spells.spell.find(x=>x.name.toLowerCase() === spell.name!.toLowerCase())
        if(spellData) {
            let classes = spellData.classes?.fromClassList || []
            let subclasses = spellData.classes?.fromSubclass || []
            return {classes, subclasses}
        }
    }
    return null
}
export interface RemoteSpellData {
    "class": {
        [classSource: string]: {
            [className: string]: boolean
        }
    },
    "subclass": {
        [classSource: string]: {
            [className: string]: {
                [subclassSource: string]: {
                    [subclassName: string]: {
                        name: string
                    }
                }
            }
        }
    }
}
export type RemoteSpellSourceData = {
    [source: string]: {
        [spellName: string]: RemoteSpellData
    }
}
let promise: Promise<RemoteSpellSourceData | null>
async function loadRemoteSpellData(): Promise<RemoteSpellSourceData | null> {
    try {
        let response = await fetch("https://5e.tools/data/generated/gendata-spell-source-lookup.json")
        if(response.status !== 200) throw Error("Cry")
        let f = await response.json() as RemoteSpellSourceData
        return f
    } catch(e) {
        console.error("Error fetching spell data", e)
        return null
    }
}

export async function getRemoteSpellData(): Promise<RemoteSpellSourceData | null> {
    if(promise) return promise
    promise = loadRemoteSpellData()
    return promise
}
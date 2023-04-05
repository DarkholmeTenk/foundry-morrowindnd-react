import {FLAG_SCOPE} from "./FlagHelper";

interface MigrateAll {
    oldScope: string
}
interface MigrateOne {
    oldScope: string,
    oldKey: string,
    newKey?: string
}
type Migration = MigrateAll | MigrateOne

async function move(target: DocumentBase, oldScopeData: any, newScopeData: any, oldKey: string, newKey?: string | undefined) {
    if(!oldScopeData[oldKey]) return
    let targetKey = newKey ?? oldKey
    if(newScopeData[targetKey]) return
    await target.setFlag(FLAG_SCOPE, targetKey, oldScopeData[oldKey])
}

export async function migrate<T extends DocumentBase>(collection: DocumentCollection<T>, migration: Migration) {
    let {oldScope} = migration
    await Promise.all(game.journal.map(async (journal)=>{
        let flags = journal.flags
        let oldScopeData = flags[oldScope]
        let newScopeData = flags[FLAG_SCOPE] ?? {}
        if(!oldScopeData) return
        if("oldKey" in migration) {
            let {oldKey, newKey} = migration
            await move(journal, oldScopeData, newScopeData, oldKey, newKey)
        } else {
            await Promise.all(Object.keys(oldScopeData).map(async (oldKey)=> move(journal, oldScopeData, newScopeData, oldKey)))
        }
    }))
}
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";

const OLD_KEYS = ["morrowindnd.", "moss."]

async function migrate(oldKey: string, setting: Setting) {
    let newKey = setting.key.replace(oldKey, FLAG_SCOPE + ".")
    let targetSetting = game.settings.settings.get(newKey)
    if(targetSetting) {
        await game.settings.set(FLAG_SCOPE, targetSetting.key, setting.value)
        await setting.delete()
    }
}

export async function migrateSettings() {
    await OLD_KEYS.forEachAsync(async (oldKey)=>{
        await game.settings.storage.get("world").contents.filter(x=>x.key.startsWith(oldKey)).forEachAsync(x=>migrate(oldKey, x))
    })
}
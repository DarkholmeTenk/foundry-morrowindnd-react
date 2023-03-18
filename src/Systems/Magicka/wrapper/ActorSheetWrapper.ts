import {FLAG_SCOPE} from "../../../Util/Helper/FlagHelper";
import {getMagicka, MagickaFlagKey} from "../MagickaFlag";

async function getData(wrapped: Function, options: any) {
    let magicka = getMagicka(this.object)
    let context = await wrapped(options)
    context.resources.push({
        name: "magicka",
        label: "Magicka",
        placeholder: "Magicka",
        value: magicka.current,
        max: magicka.max
    })
    return context
}

async function update(wrapped: Function, event: any, data: any) {
    if("system.resources.magicka.value" in data) {
        delete data["system.resources.magicka.label"]
        delete data["system.resources.magicka.lr"]
        delete data["system.resources.magicka.sr"]
        data["flags." + FLAG_SCOPE + "." + MagickaFlagKey + ".current"] = data["system.resources.magicka.value"]
        data["flags." + FLAG_SCOPE + "." + MagickaFlagKey + ".max"] = data["system.resources.magicka.max"]
    }
    return wrapped(event, data)
}

export function wrapActorSheets() {
    libWrapper.register(FLAG_SCOPE, "dnd5e.applications.actor.ActorSheet5eCharacter.prototype.getData", getData)
    libWrapper.register(FLAG_SCOPE, "dnd5e.applications.actor.ActorSheet5eCharacter.prototype._updateObject", update)
}
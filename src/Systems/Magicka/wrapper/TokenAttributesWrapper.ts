import {FLAG_SCOPE} from "Util/Helper/FlagHelper";
import {getMagicka, MagickaFlagKey} from "../MagickaFlag";

interface TrackedAttributes {
    "Attribute Bars": string[],
    "Single Values": string[]
}
export function tokenAttributesWrapper(wrapped: (attributes: any)=>TrackedAttributes, attributes: any) {
    let originalValue = wrapped(attributes)
    originalValue["Attribute Bars"].push("attributes.magicka")
    return originalValue
}

export function tokenGetAttribute(wrapped: Function, barName: string, {alternative}: {alternative?: string} = {}) {
    const attr = alternative || this[barName]?.attribute
    if(attr === "attributes.magicka") {
        let {current, max} = getMagicka(this.actor)
        return {
            type: "bar",
            attribute: attr,
            value: current,
            max: max,
            editable: true
        }
    } else {
        return wrapped(barName, {alternative})
    }
}

export async function modifyTokenAttribute(wrapped: Function, attribute: string, value: any, isDelta: boolean, isBar: boolean) {
    if(attribute === "attributes.magicka") {
        let {current, max} = getMagicka(this)
        await this.setFlag(FLAG_SCOPE, MagickaFlagKey, {current: isDelta? value+ current:value, max})
        return this
    } else {
        return wrapped(attribute, value, isDelta, isBar)
    }
}

export function wrapTokenAttributes() {
    libWrapper.register(FLAG_SCOPE, "TokenDocument.getTrackedAttributeChoices", tokenAttributesWrapper, "WRAPPER")
    libWrapper.register(FLAG_SCOPE, "TokenDocument.prototype.getBarAttribute", tokenGetAttribute)
    libWrapper.register(FLAG_SCOPE, "Actor.prototype.modifyTokenAttribute", modifyTokenAttribute)
}
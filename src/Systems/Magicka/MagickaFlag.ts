import {FLAG_SCOPE} from "../../Util/Helper/FlagHelper";

export interface MagickaFlag {
    current: number
    max: number
}
export const MagickaFlagKey = "magicka"

export const DefaultMagickaFlag: MagickaFlag = {
    current: 0,
    max: 0
}

export function getMagicka(actor: Actor5e): MagickaFlag {
    let base: MagickaFlag = actor.getFlag(FLAG_SCOPE, MagickaFlagKey) ?? DefaultMagickaFlag
    return base
}
import getFlag from "Util/Helper/FlagHelper";

const SpellSellerFlagKey = "SpellSeller"
interface SpellSellerFlag {

}

export function getSpellSellerFlag(actor: Actor5e) {
    return getFlag<SpellSellerFlag>(actor, SpellSellerFlagKey, {})
}
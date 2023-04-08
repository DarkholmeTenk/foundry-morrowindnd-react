import {itemPrice} from "Util/Extension/Items";
import getFlag from "Util/Helper/FlagHelper";

const SpellSellerFlagKey = "SpellSeller"
interface SpellSellerFlag {

}

export function getMerchantFlag(actor: Actor) {
    return getFlag<SpellSellerFlag>(actor, SpellSellerFlagKey, {})
}
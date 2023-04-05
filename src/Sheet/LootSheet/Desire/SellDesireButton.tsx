import {hasSellFlag} from "./SellDesire";

export function getSellDesireItems(actor: Actor): Item5e[] {
    return actor.items.filter(i=>hasSellFlag(i))
}

import {SpellPurchasePriceModifier} from "Sheet/SpellSellerSheet/SpellCostCalculator";
import {StateSetter} from "Util/React/update/Updater";
import Styles from "./PurchaseModal.module.scss"
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

const Labels: {[key in SpellPurchasePriceModifier]: {
    name: string,
    tooltip: string
}} = {
    [SpellPurchasePriceModifier.NONE]: {
        name: "Base Price",
        tooltip: "If you have the correct class for the spell"
    },
    [SpellPurchasePriceModifier.SPEC]: {
        name: "Specialised",
        tooltip: "If you have the correct class for the spell and it fits your speciality (e.g. Life spell for a Life cleric)"
    },
    [SpellPurchasePriceModifier.CROSS_CLASS]: {
        name: "Cross Class",
        tooltip: "If you are a ranger buying a wizard spell, or a wizard buying a cleric spell"
    },
    [SpellPurchasePriceModifier.NO_SPEC]: {
        name: "No Specialisation",
        tooltip: "If you are buying a spell that belongs to your class, but your class has no magical specialisation (e.g. ranger)"
    }
}
const ButtonList = [SpellPurchasePriceModifier.NONE, SpellPurchasePriceModifier.SPEC, SpellPurchasePriceModifier.CROSS_CLASS, SpellPurchasePriceModifier.NO_SPEC]

interface Props {
    modifier: SpellPurchasePriceModifier
    setModifier: StateSetter<SpellPurchasePriceModifier>
}
export function PurchasePriceModifierButtons({modifier, setModifier}: Props) {
    return <div className={Styles.PriceModifierButtons}>
        {ButtonList.map(y=><Button tooltip={Labels[y].tooltip} disabled={modifier === y} onClick={()=>setModifier(y)} key={y}>{Labels[y].name}</Button>)}
    </div>
}
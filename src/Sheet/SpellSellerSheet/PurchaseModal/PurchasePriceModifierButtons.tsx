import {SpellPurchasePriceModifier} from "Sheet/SpellSellerSheet/SpellCostCalculator";
import {StateSetter} from "Util/React/update/Updater";
import {Tooltip} from "@mui/material";
import {e} from "Util/Helper/DomEventHelper";
import Styles from "./PurchaseModal.module.scss"

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

function Button({text, tooltip, selected, onClick}: {text: string, tooltip: string, selected: boolean, onClick: ()=>void}) {
    return <Tooltip title={tooltip}>
        <span>
            <button disabled={selected} onClick={e(onClick)}>
                {text}
            </button>
        </span>
    </Tooltip>
}

interface Props {
    modifier: SpellPurchasePriceModifier
    setModifier: StateSetter<SpellPurchasePriceModifier>
}
export function PurchasePriceModifierButtons({modifier, setModifier}: Props) {
    return <div className={Styles.PriceModifierButtons}>
        {ButtonList.map(y=><Button text={Labels[y].name} tooltip={Labels[y].tooltip} selected={modifier === y} onClick={()=>setModifier(y)} key={y}/>)}
    </div>
}
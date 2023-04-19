import {Box, Modal} from "@mui/material";
import {useState} from "react";
import Styles from "./PurchaseModal.module.scss"
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import {getDefaultPurchasePriceModifier} from "Sheet/SpellSellerSheet/SpellData/SpellData";
import {PurchasePriceModifierButtons} from "Sheet/SpellSellerSheet/PurchaseModal/PurchasePriceModifierButtons";
import ItemViewer from "Util/Components/ItemViewer/ItemViewer";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {calculateSpellCost} from "Sheet/SpellSellerSheet/SpellCostCalculator";
import {useMoneyRequest} from "Systems/GroupPay/useMoneyRequest";
import {getGoldAmountFromActor} from "Util/Helper/GoldHelper";
import {SpellSellerBuy} from "Sheet/SpellSellerSheet/SpellSellerAction";
import {SuspenseLayer} from "Util/Suspense/SuspenseLoadIndicator";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

function PurchaseWindow({merchant, spell, self, close}: Props) {
    let baseModifier = useSuspensePromise("spellseller.basemodifier", ()=>getDefaultPurchasePriceModifier(self, spell), [spell, self])
    let [modifier, setModifier] = useState(baseModifier)
    let {canRequestMoney, requestMoney} = useMoneyRequest()
    let price = calculateSpellCost(spell, modifier) ?? 0
    let canAfford = getGoldAmountFromActor(self) >= price
    let doBuy = ()=>{
        SpellSellerBuy({merchant: merchant.uuid, self: self.uuid, spell: spell.uuid, modifier})
        close()
    }
    return <div>
        <div>
            <h3>Buying spell</h3>
            <ItemViewer item={spell} />
        </div>
        <hr />
        <div>
            <h3>Price modifier</h3>
            <p>This chooses what price you're going to pay for the spell, based on your class.<br />We try to autodetermine this, but it's not perfect</p>
            <PurchasePriceModifierButtons modifier={modifier} setModifier={setModifier} />
        </div>
        <hr />
        <div className={Styles.ActionSection}>
            <div>
                <h3>Price</h3>
                <GoldDisplay value={price} />
            </div>
            <div>
                <h3>Available</h3>
                <GoldDisplay actor={self} />
            </div>
            <div>
                <Button onClick={()=>requestMoney(price, "To buy spell: " + spell.name)} disabled={!canRequestMoney && price > 0}>Request money from Party</Button>
                <Button onClick={doBuy} disabled={!canAfford}>Buy Spell</Button>
            </div>
        </div>
    </div>
}

interface Props {
    merchant: Actor5e,
    spell: ItemSpell,
    self: Actor5e,
    close: ()=>void
}
export function PurchaseModal({merchant, self, spell, close}: Props) {
    return <Modal open={true} onClose={close} >
        <Box className={Styles.Box}>
            <SuspenseLayer>
                <PurchaseWindow merchant={merchant} self={self} spell={spell} close={close} />
            </SuspenseLayer>
        </Box>
    </Modal>
}
import {Slider} from "@mui/material";
import {useState} from "react";
import {StoredSellables} from "../MerchantInventory/Settings";
import Styles from "./MerchantFlagComponent.module.scss"
import {DeleteIcon} from "Util/Components/SimpleComponents/IconLibrary";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import Selector from "Util/Components/Selector/Selector";

export default function MerchantFlagComponent({merchantFlag, setMerchantFlag}) {
    let [buyRate, setBuyRate] = useState(merchantFlag.buyRate)
    let [sellRate, setSellRate] = useState(merchantFlag.sellRate)
    let [sellables, setSellable] = useState(merchantFlag.sellables)
    return <div className={Styles.MerchantFlagComponent}>
        <div className="flexrow">
            Buy Rate:
            <Slider value={buyRate} onChange={(e,v)=>setBuyRate(v)} min={1} max={4} step={0.1} />
            {buyRate}
        </div>
        <div className="flexrow">
            Sell Rate:
            <Slider value={sellRate} onChange={(e,v)=>setSellRate(v)} min={0.1} max={1} step={0.1} />
            {sellRate}
        </div>
        <div className="flexrow">
            <Selector values={Object.keys(StoredSellables.value).sort()} value={sellables} setValue={setSellable} includeNull/>
            <Button onClick={()=>setSellable(null)} icon={DeleteIcon} />
        </div>
        <Button onClick={()=>setMerchantFlag({...merchantFlag, sellables, buyRate, sellRate})}>
            Save
        </Button>
    </div>
}
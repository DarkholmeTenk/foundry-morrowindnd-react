import {Button, Paper, Slider} from "@material-ui/core";
import {useState} from "react";

export default function MerchantFlagComponent({merchantFlag, setMerchantFlag}) {
    let [buyRate, setBuyRate] = useState(merchantFlag.buyRate)
    let [sellRate, setSellRate] = useState(merchantFlag.sellRate)
    return <Paper>
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
        <Button onClick={()=>setMerchantFlag({...merchantFlag, buyRate, sellRate})}>
            Save
        </Button>
    </Paper>
}
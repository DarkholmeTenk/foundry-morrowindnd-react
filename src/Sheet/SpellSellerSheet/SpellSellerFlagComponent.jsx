import {Button, MenuItem, Paper, Select, Slider} from "@material-ui/core";
import {useState} from "react";

export default function SpellSellerFlagComponent({merchantFlag, setMerchantFlag}) {
    let [buyRate, setBuyRate] = useState(merchantFlag.buyRate)
    return <Paper>
        <div className="flexrow">
            Buy Rate:
            <Slider value={buyRate} onChange={(e,v)=>setBuyRate(v)} min={1} max={4} step={0.1} />
            {buyRate}
        </div>
        <Button onClick={()=>setMerchantFlag({...merchantFlag, buyRate})}>
            Save
        </Button>
    </Paper>
}
import {Button, MenuItem, Paper, Select, Slider} from "@material-ui/core";
import {useState} from "react";
import {StoredSellables} from "./Sellable/Settings";

export default function MerchantFlagComponent({merchantFlag, setMerchantFlag}) {
    let [buyRate, setBuyRate] = useState(merchantFlag.buyRate)
    let [sellRate, setSellRate] = useState(merchantFlag.sellRate)
    let [sellables, setSellable] = useState(merchantFlag.sellables)
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
        <div className="flexrow">
            <Select value={sellables || "_"} onChange={(e)=>setSellable(e.target.value)}>
                {Object.keys(StoredSellables.value).sort().map(source=><MenuItem value={source} key={source}>
                    {source}
                </MenuItem>)}
            </Select>
            <a onClick={()=>setSellable(null)}><i className="fas fa-trash"/></a>
        </div>
        <Button onClick={()=>setMerchantFlag({...merchantFlag, sellables, buyRate, sellRate})}>
            Save
        </Button>
    </Paper>
}
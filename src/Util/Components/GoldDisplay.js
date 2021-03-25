import {CurrencyRates, getGoldBreakdown} from "../Helper/GoldHelper";

export default function GoldDisplay({value}) {
    if(value === 0) {
        return <span>0 gp</span>
    }
    let breakdown = getGoldBreakdown(value)
    return <span>
        {CurrencyRates.filter(x=>breakdown[x.name]).map(({name})=>{
            return <span key={name}>{breakdown[name]}{name}</span>
        })}
    </span>
}
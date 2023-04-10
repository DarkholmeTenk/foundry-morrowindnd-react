import {CurrencyRates, getGoldAmountFromActor, getGoldBreakdown, parseGold} from "../Helper/GoldHelper";

interface ValueDisplay {
    value: number | string,
    actor?: undefined
}
interface ActorDisplay {
    actor: Actor5e,
    value?: undefined
}
type DisplayProps = ActorDisplay | ValueDisplay

interface Props {
    value: number
}
export default function GoldDisplay({value, actor}: DisplayProps) {
    let realValue = actor ? getGoldAmountFromActor(actor) : parseGold(value)
    if(realValue === 0 || isNaN(realValue)) {
        return <span>0 gp</span>
    }
    let breakdown = getGoldBreakdown(realValue)
    return <span>
        {CurrencyRates.filter(x=>breakdown[x.name]).map(({name})=>{
            return <span key={name}>{breakdown[name]}{name}</span>
        })}
    </span>
}
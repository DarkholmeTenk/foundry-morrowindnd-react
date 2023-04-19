import {
    CurrencyRates, CurrencyRatesMap, CurrencyType,
    getGoldAmountFromActor,
    getGoldBreakdown,
    GoldBreakdown,
    parseGold
} from "Util/Helper/GoldHelper";
import {
    GoldDisplayShowBreakdownSetting,
    GoldDisplayUseColoursSetting,
    GoldDisplayUsePPSetting
} from "Util/Components/GoldDisplay/GoldDisplaySetting";
import Styles from "./GoldDisplay.module.scss"

function handleSettings(value: number): GoldBreakdown {
    if(!GoldDisplayShowBreakdownSetting.value) {
        let breakdown: GoldBreakdown = {}
        breakdown.gp = parseGold(value)
        return breakdown
    }
    let breakdown = getGoldBreakdown(value)
    if(!GoldDisplayUsePPSetting.value) {
        breakdown.gp = (breakdown.gp ?? 0) + ((breakdown.pp ?? 0) * CurrencyRatesMap[CurrencyType.pp].m)
        breakdown.pp = 0
    }
    return breakdown
}

interface ValueDisplay {
    value: number | string,
    actor?: undefined
}
interface ActorDisplay {
    actor: Actor5e,
    value?: undefined
}
type DisplayProps = ActorDisplay | ValueDisplay

function formatNum(value: number | undefined): string {
    if(!value) return ""
    return value.toLocaleString(undefined, {
        maximumFractionDigits: 2
    })
}

interface Props {
    value: number
}
export default function GoldDisplay({value, actor}: DisplayProps) {
    let realValue = actor ? getGoldAmountFromActor(actor) : parseGold(value)
    let className = Styles.GoldDisplay
    if(GoldDisplayUseColoursSetting.value) className += " " + Styles.Color
    if(realValue === 0 || isNaN(realValue)) {
        return <span>0 gp</span>
    }
    let breakdown = handleSettings(realValue)
    return <span className={className}>
        {CurrencyRates.filter(x=>breakdown[x.name]).map(({name})=>{
            return <span key={name} className={Styles[name]}>{formatNum(breakdown[name])}{name}</span>
        })}
    </span>
}
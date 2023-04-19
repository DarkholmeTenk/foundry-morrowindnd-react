import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import Styles from "./BuySheet.module.scss"
import {MouseEvent} from "react";

function getNewValue(positive: boolean, value: number, e: MouseEvent<unknown>, max: number):number {
    if(e.shiftKey) {
        if(positive)
            return max
        else
            return 1
    }
    let m = 1
    if(e.ctrlKey) m = 10
    if(!positive) m = -m
    return value + m
}

export function BuyQtyInput({value, setValue, max}: {value: number, setValue: (newValue: number)=>void, max: number}) {
    let up = (e: MouseEvent<unknown>, p: boolean) => setValue(getNewValue(p, value, e, max))
    return <div className={Styles.AmountChooser}>
        <Button onClick={(e)=>up(e, false)} icon="fas fa-circle-minus" disabled={value <= 1} />
        <input type="number" value={value} onChange={(e)=>setValue(e.target.valueAsNumber)} />
        <Button onClick={(e)=>up(e, true)} icon="fas fa-circle-plus" disabled={value >= max} />
    </div>
}
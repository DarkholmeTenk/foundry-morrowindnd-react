import ItemViewer from "../../Util/ItemViewer"
import {Button, Slider} from "@material-ui/core";
import {useContext, useState} from "react";
import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication";

import styles from "./ItemQuantitySelector.module.scss"
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";

export function ItemQuantitySelect({item, max, onConfirm, buttonText = "Confirm", text}) {
    let [qty, setQty] = useState(max)
    let app = useContext(AppContext)
    let buttonString = ""
    if(typeof(buttonText) === "function") {
        buttonString = buttonText(qty, item)
    } else {
        buttonString = buttonText
    }
    return <div>
        <ItemViewer item={item} />
        {text}
        {max > 1 ? <div className={styles.sliderRow}>
            <div className={styles.sliderHolder}> <Slider value={qty} onChange={(e,v)=>setQty(v)} max={max} /> </div>
            <div className={styles.numbers}> {qty} / {max} </div>
        </div> : null}
        <Button onClick={(e)=>{
            e.preventDefault()
            onConfirm(qty)
            app.close()
        }}>{buttonString}</Button>
    </div>
}

export function openItemQuantitySelect({item, max, onConfirm, buttonText = "Confirm", text}) {
    new SimpleReactApplication(<ItemQuantitySelect {...{item, max, onConfirm, buttonText, text}} />, {width: 600, height: 180}).render(true)
}
import ItemViewer, {ItemViewerProps} from "../../Util/Components/ItemViewer/ItemViewer"
import {Button, Slider} from "@material-ui/core";
import React, {useContext, useState} from "react";

// @ts-ignore
import styles from "./ItemQuantitySelector.module.scss"
import {ReactNodeLike} from "prop-types";
import {SimpleReactApplication} from "../../Util/React/ReactApplication";
import ApplicationContext from "../../Util/React/core/ApplicationContext";

export function ItemQuantitySelect({item, max, onConfirm, buttonText = "Confirm", text}: ItemQuantitySelectArgs) {
    let [qty, setQty] = useState(max)
    let app = useContext(ApplicationContext) as any
    let buttonString: ReactNodeLike = ""
    if(typeof(buttonText) === "function") {
        buttonString = buttonText(qty, item)
    } else {
        buttonString = buttonText
    }
    return <div>
        <ItemViewer item={item} />
        {text}
        {max > 1 ? <div className={styles.sliderRow}>
            <div className={styles.sliderHolder}> <Slider value={qty} onChange={(e,v)=>setQty(v as number)} max={max} /> </div>
            <div className={styles.numbers}> {qty} / {max} </div>
        </div> : null}
        <Button disabled={qty === 0} onClick={(e)=>{
            e.preventDefault()
            onConfirm(qty)
            app.close()
        }}>{buttonString}</Button>
    </div>
}

interface ItemQuantitySelectArgs {
    item: ItemViewerProps,
    max: number,
    onConfirm: (number)=>any,
    buttonText: ReactNodeLike | ((number, Item)=>ReactNodeLike),
    text?: ReactNodeLike
}
export function openItemQuantitySelect({item, max, onConfirm, buttonText = "Confirm", text}: ItemQuantitySelectArgs) {
    new SimpleReactApplication(<ItemQuantitySelect {...{item, max, onConfirm, buttonText, text}} />, {width: 600, height: 180}).render(true)
}
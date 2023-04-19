import {MISEditorProps} from "Sheet/MerchantSheet/MerchantInventory/Config/SingleMerchantInventorySourceEditor";
import {
    MerchantInventorySourcePackFilter
} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import {loadSellable} from "Sheet/MerchantSheet/MerchantInventory/MerchantInventoryLoader";
import {useReducer} from "react";
import ItemViewer from "Util/Components/ItemViewer/ItemViewer";
import Styles from "./SellableSourceEditor.module.scss"
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

export function MISEditorFilterRightPane({value}: MISEditorProps<MerchantInventorySourcePackFilter>) {
    let [rVal, refresh] = useReducer(x=>x+1,0)
    let items = useSuspensePromise("miseditor.filter.right", ()=>loadSellable(value), [rVal])
    return <div className={Styles.FilterSample}>
        <Button onClick={refresh}>Refresh</Button>
        <div>
            {items.filter((_,i)=>i<100).map((x,i)=><ItemViewer item={x.item} key={i}/>)}
        </div>
    </div>
}

export function MISEditorFilter({value, setValue}: MISEditorProps<MerchantInventorySourcePackFilter>) {
    return <div className={Styles.Filter}>
        <input value={value.filter} onChange={(e)=>setValue(old=>({...old, filter: e.target.value}))}/>
    </div>
}
import {MISEditorProps} from "Sheet/MerchantSheet/MerchantInventory/Config/SingleMerchantInventorySourceEditor";
import {
    ReferencedMerchantInventorySource
} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";
import {useContext} from "react";
import {StoredSellableContext} from "Sheet/MerchantSheet/MerchantInventory/Config/StoredSellableComponent";
import Selector from "Util/Components/Selector/Selector";
import {StringSorter} from "Util/Sorting";

export function MISEditorReferenced({value, setValue}: MISEditorProps<ReferencedMerchantInventorySource>) {
    let {store, editing} = useContext(StoredSellableContext)
    let values = Object.keys(store).filter(x=>x !== editing).sort(StringSorter)
    return <div>
        <Selector values={values} value={value.merchantInventoryId} setValue={(v)=>setValue(o=>({...o, merchantInventoryId: v}))} includeNull />
    </div>
}
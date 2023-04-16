import {MISEditorProps} from "Sheet/MerchantSheet/MerchantInventory/Config/SingleMerchantInventorySourceEditor";
import {
    MerchantInventorySourcePackFilter
} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";

export function MISEditorFilterRightPane({value}: MISEditorProps<MerchantInventorySourcePackFilter>) {
    return <div>

    </div>
}

export function MISEditorFilter({value, setValue}: MISEditorProps<MerchantInventorySourcePackFilter>) {
    return <div>
        FILTERME!
    </div>
}
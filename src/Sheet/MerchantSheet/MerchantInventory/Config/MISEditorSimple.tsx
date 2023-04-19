import {MISEditorProps} from "Sheet/MerchantSheet/MerchantInventory/Config/SingleMerchantInventorySourceEditor";
import {MerchantInventorySourceSimple} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";
import {useMappedSetter} from "Util/React/update/Updater";
import {ItemUUIDViewer} from "Util/Components/ItemViewer/ItemViewer";
import {useArrayReducers} from "Util/Helper/ArrayReducers";
import {onDrop} from "Util/Helper/DropHelper";
import {isHoldable} from "Util/Helper/ItemHelper";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

export function MISEditorSimple({value, setValue}: MISEditorProps<MerchantInventorySourceSimple>) {
    let itemIds = value.itemIds
    let setItemIds = useMappedSetter("itemIds", setValue)
    let [updater, adder, remover] = useArrayReducers(setItemIds)
    let dropHandler = onDrop(i=>{
        if(i instanceof Item && isHoldable(i._source) && !itemIds.includes(i.uuid)) adder(i.uuid)
    })
    return <div onDrop={dropHandler}>
        <span>Items ({itemIds.length}):</span>
        <ul>
            {itemIds.map((x, i)=><li key={x}>
                <ItemUUIDViewer item={x} />
                <Button onClick={()=>remover(i)} icon="fas fa-trash" />
            </li>)}
        </ul>
    </div>
}
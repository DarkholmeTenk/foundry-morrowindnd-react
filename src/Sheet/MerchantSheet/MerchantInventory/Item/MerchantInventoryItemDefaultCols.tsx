import {TableColumn} from "../../../../Util/Components/NewItemTable/TableColumn";
import {miiPrice, miiQty} from "./MerchantInventoryItemData";
import {getBuyPrice, MerchantFlag} from "../../Flag/MerchantFlag";
import GoldDisplay from "../../../../Util/Components/GoldDisplay";
import ItemDescription from "../../../../Util/Components/ItemDescription";

type MIICol<X> = TableColumn<X, MerchantInventoryItem>
export const MIIImageCol: MIICol<{}> = {label: "", ColumnComponent: ({item})=>(<img width="24px" height="24px" src={item.item.img} />), cellProps: {width: 26}}
export const MIINameCol: MIICol<{}> = {label: "Name", ColumnComponent: ({item})=>(<>{item.item.name}</>)}
export const MIIQtyCol: MIICol<{}> = {label: "Qty", ColumnComponent: ({item})=>(<>{miiQty(item)}</>)}
export const MIIPriceCol: MIICol<{merchantFlag: MerchantFlag}> = {label: "Price", ColumnComponent: ({item, merchantFlag, })=>(<GoldDisplay value={getBuyPrice(item, 1, merchantFlag)} />)}

export function MIIExpander({item}: {item: MerchantInventoryItem}) {
    let description = item.item.system.description?.value ?? "No description found"
    return <ItemDescription description={description} />
}

export const DefaultMIICols = [
    MIIImageCol,
    MIINameCol,
    MIIQtyCol,
    MIIPriceCol
]
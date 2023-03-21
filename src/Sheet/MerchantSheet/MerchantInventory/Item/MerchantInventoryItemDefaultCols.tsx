import {TableColumn} from "../../../../Util/Components/NewItemTable/TableColumn";
import {miiPrice, miiQty} from "./MerchantInventoryItemData";

type MIICol<X> = TableColumn<X, MerchantInventoryItem>
export const MIIImageCol: MIICol<{}> = {label: "", ColumnComponent: ({item})=>(<img width="24px" height="24px" src={item.item.img} />)}
export const MIINameCol: MIICol<{}> = {label: "Name", ColumnComponent: ({item})=>(<>{item.item.name}</>)}
export const MIIQtyCol: MIICol<{}> = {label: "Qty", ColumnComponent: ({item})=>(<>{miiQty(item)}</>)}
export const MIIPriceCol: MIICol<{}> = {label: "Price", ColumnComponent: ({item})=>(<>{miiPrice(item)}</>)}

export const DefaultMIICols = [
    MIIImageCol,
    MIINameCol,
    MIIQtyCol,
    MIIPriceCol
]
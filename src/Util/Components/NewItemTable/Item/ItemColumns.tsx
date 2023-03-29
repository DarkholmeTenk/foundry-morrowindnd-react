import {getterColumn} from "../Util/GetterColumn";
import {NumberFormat} from "../Util/Formats";

export const ImageColumn = getterColumn<Item5e>("", (item)=><img width="24px" height="24px" src={item.img} />, {cellProps: {width: 26}})
export const NameColumn = getterColumn<Item5e>("Name", (item)=>item.name)
export const QtyColumn = getterColumn<Item5e>("Qty", (item)=>item.qty())
export const WeightColumn = getterColumn<Item5e>("Weight", (item)=>NumberFormat.format(item.weight()))

export const DefaultItemColumns = [
    ImageColumn,
    NameColumn,
    WeightColumn,
    QtyColumn
]
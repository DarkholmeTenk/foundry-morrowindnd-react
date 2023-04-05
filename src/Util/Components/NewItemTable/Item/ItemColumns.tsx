import {getterColumn} from "../Util/GetterColumn";
import {NumberFormat} from "../Util/Formats";
import {BasicImageColumn} from "../Util/BasicColumns";
import {mappedColumn} from "../Util/MapColumns";

export const ImageColumn = mappedColumn((item: Item5e)=>item.img, BasicImageColumn)
export const NameColumn = getterColumn<Item5e>("Name", (item)=>item.name)
export const QtyColumn = getterColumn<Item5e>("Qty", (item)=>item.qty())
export const WeightColumn = getterColumn<Item5e>("Weight", (item)=>NumberFormat.format(item.weight()))

export const DefaultItemColumns = [
    ImageColumn,
    NameColumn,
    WeightColumn,
    QtyColumn
]
import {TableColumn} from "../TableColumn";
import {getterColumn} from "../Util/GetterColumn";
import {NumberFormat} from "../Util/Formats";

export const ImageColumn = getterColumn<Item>("", (item)=><img width="24px" height="24px" src={item.img} />)
export const NameColumn = getterColumn<Item>("Name", (item)=>item.name)
export const QtyColumn = getterColumn<Item>("Qty", (item)=>item.qty())
export const WeightColumn = getterColumn<Item>("Weight", (item)=>NumberFormat.format(item.weight()))

export const DefaultItemColumns = [
    ImageColumn,
    NameColumn,
    WeightColumn,
    QtyColumn
]

export const TestColumn: TableColumn<{test: string}, Item> = {
    label: "Test",
    ColumnComponent: ({item, test})=><div>
        {test} - {item.name}
    </div>
}

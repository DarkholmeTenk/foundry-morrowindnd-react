import {TableColumn} from "../TableColumn";
import {ReactNode} from "react";

export function getterColumn<T>(label: string, getter: (item: T)=>string | number | ReactNode): TableColumn<{ }, T> {
    return {
        label,
        ColumnComponent: ({item})=><>{getter(item)}</>
    }
}
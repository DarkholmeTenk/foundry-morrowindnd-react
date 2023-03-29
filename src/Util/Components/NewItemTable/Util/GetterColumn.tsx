import {TableColumn} from "../TableColumn";
import {ReactNode} from "react";

type Opts<T> = Omit<TableColumn<{ }, T>, "ColumnComponent" | "label">
export function getterColumn<T>(label: string, getter: (item: T)=>string | number | ReactNode, opts: Opts<T> = {}): TableColumn<{ }, T> {
    return {
        ...opts,
        label,
        ColumnComponent: ({item})=><>{getter(item)}</>
    }
}
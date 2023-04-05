import {TableColumn} from "../TableColumn";

export function mappedColumn<U, T, D>(mapper: (u: U)=>T, column: TableColumn<D, T>): TableColumn<D, U> {
    let Col = column.ColumnComponent
    return {
        ...column,
        ColumnComponent: ({item, index, ...extra})=><Col index={index} item={mapper(item)} {...(extra as D)} />
    }
}

export function mappedColumns<U, T, D>(mapper: (u: U)=>T, cols: TableColumn<D, T>[]): TableColumn<D, U>[] {
    return cols.map((c)=>mappedColumn(mapper, c))
}
import {TableColumn} from "../TableColumn";

export function mappedColumn<U, T, D>(mapper: (u: U)=>T, cols: TableColumn<D, T>[]): TableColumn<D, U>[] {
    return cols.map((c)=>{
        let Col = c.ColumnComponent
        return {
            ...c,
            ColumnComponent: ({item, index, ...extra})=><Col index={index} item={mapper(item)} {...(extra as D)} />
        }
    })
}
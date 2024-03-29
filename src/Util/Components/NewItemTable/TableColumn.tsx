import React from "react";

export type TableColumnComponent<D, T> = React.FC<D & {item: T, index: number}> | React.FC<D & {item: T}>

export interface TableColumn<D, T> {
    label: string,
    ColumnComponent: TableColumnComponent<D, T>
    cellProps?: {
        width?: number
    }
}
import React from "react";
import {Column, NumberFormat} from "./ItemTable";

export const ItemColumnImage: Column = {
    title: "",
    getter: ({item: i}) => <img width="24px" height="24px" src={i.img}/>
}
export const ItemColumnName: Column = {
    title: "Name",
    getter: ({item: i}) => i.name,
    sortable: true
}
export const ItemColumnWeight: Column = {
    title: "Weight",
    getter: ({item: i}) => NumberFormat.format(i.data.data.weight),
    sortable: true
}
export const ItemColumnQty: Column = {
    title: "Qty",
    getter: ({item: i}) => i.data.data.quantity,
    sortable: true
}
export const ItemColumnDefaults: Column[] = [ItemColumnImage, ItemColumnName, ItemColumnWeight, ItemColumnQty]
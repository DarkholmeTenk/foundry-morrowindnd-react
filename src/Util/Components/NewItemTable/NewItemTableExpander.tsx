import React from "react";

export type ItemExpander<T, D> = React.FC<D & {item: T}>

interface ItemExpanderComponentProps<T, D> {
    item: T,
    data: D,
    Expander?: ItemExpander<T, D>
}
export function ItemExpanderComponent<T, D>({item, data, Expander}: ItemExpanderComponentProps<T, D>) {
    if(!Expander) return null
    return <Expander item={item} {...data} />
}
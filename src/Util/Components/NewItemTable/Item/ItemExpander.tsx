import ItemDescription from "../../ItemDescription";
import React from "react";

export function ItemExpander({item}: {item: Item}) {
    return <ItemDescription description={item.system.description?.value || "No Description found"} />
}
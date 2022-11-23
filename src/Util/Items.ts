export function itemQty(item: Item): number {
    if (!("quantity" in item.system)) return 0
    return item.system.quantity ?? 0
}
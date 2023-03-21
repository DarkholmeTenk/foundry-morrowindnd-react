interface MerchantInventoryItem5e {
    type: "item5e"
    item: Item5e
    qty?: number
    onBuy?: (qty: number)=>Promise<void>
}

interface MerchantInventoryItemData {
    type: "itemdata"
    item: SmartItemData
    qty?: number
}

type MerchantInventoryItem = MerchantInventoryItem5e | MerchantInventoryItemData
interface BaseMerchantInventory {
    qty?: number
}

export interface MerchantInventorySourceSimple extends BaseMerchantInventory {
    type: "simple"
    itemId?: UUID
}

export interface MerchantInventorySourcePackFilter extends BaseMerchantInventory {
    type: "filter"
    packOverride?: UUID[]
    filter: string
}

export interface NestedMerchantInventorySource {
    type: "nested"
    sellables: MerchantInventorySource[]
}

export interface ReferencedMerchantInventorySource {
    type: "referenced"
    merchantInventoryId: string
}

export type MerchantInventorySource = MerchantInventorySourceSimple | MerchantInventorySourcePackFilter | NestedMerchantInventorySource | ReferencedMerchantInventorySource

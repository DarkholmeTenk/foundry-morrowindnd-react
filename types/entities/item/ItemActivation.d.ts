declare global {
    type ItemDamagePart = [amount: string, type: string]
    interface ItemDamageData {
        parts: ItemDamagePart[]
        versatile: string
    }
    interface ItemCriticalData {
        threshold: number
        damage: string
    }
    interface ItemActivationData {
        ability?: string
        actionType?: string
        attackBonus?: string
        chatFlavor?: string
        critical?: ItemCriticalData
        damage?: ItemDamageData
        formula?: string
    }
}

export {}

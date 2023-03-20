export {}

declare global {
    interface ItemActivation {
        condition?: string
        cost: number
        type: string
    }
    interface ItemTarget {
        type: string
        units: string
        value: number
        width: number | null
    }
    interface ItemRange {
        value: number
        long: number
        units: string
    }
    interface ItemDuration {
        value: number | string
        units: string
    }
    interface ItemLimitedUses {
        value: number
        max: number | string
        per: string
        recovery: string
        autoDestroy: boolean
    }
    interface ItemResourceConsumption {
        amount: number | null
        target: string
        type: string
    }

    interface ItemUsageData {
        activation?: ItemActivation
        target?: ItemTarget
        range?: ItemRange
        duration?: ItemDuration
        uses?: ItemLimitedUses
        consume?: ItemResourceConsumption
    }
}
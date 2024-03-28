export interface BasicSatchelItemDefinition {
    id: string
    name: string
    image: string | undefined
    weight: number
    value: number
}

export interface SatchelItem<T extends BasicSatchelItemDefinition> {
    definition: T,
    count: number
}
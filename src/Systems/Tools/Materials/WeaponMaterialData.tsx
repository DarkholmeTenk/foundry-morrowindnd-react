export interface WeaponMaterialData {
    name: string
    damageBonus?: number
    attackBonus?: number
    hurtsGhosts?: boolean
    averagePrice: number
}

export const MeleeMaterials: WeaponMaterialData[] = [
    {
        name: "Iron",
        attackBonus: -1,
        averagePrice: 80
    },
    {
        name: "Steel",
        averagePrice: 120
    },
    {
        name: "Silver",
        averagePrice: 180,
        hurtsGhosts: true
    },
    {
        name: "Dwemer",
        averagePrice: 400,
        damageBonus: 1
    },
    {
        name: "Orcish",
        averagePrice: 640,
        attackBonus: 1,
        damageBonus: 2
    },
    {
        name: "Ebony",
        averagePrice: 20000,
        attackBonus: 1,
        damageBonus: 3,
        hurtsGhosts: true
    },
    {
        name: "Daedric",
        averagePrice: 40000,
        attackBonus: 2,
        damageBonus: 3,
        hurtsGhosts: true
    },
    {
        name: "Chitin",
        averagePrice: 160
    },
    {
        name: "Glass",
        averagePrice: 16000
    }
]

export const RangedMaterials: WeaponMaterialData[] = [
    {
        name: "Wood",
        averagePrice: 80,
        attackBonus: -1
    },
    {
        name: "Silver",
        averagePrice: 160,
        hurtsGhosts: true
    },
    {
        name: "Bonemold",
        damageBonus: 1,
        averagePrice: 140
    },
    {
        name: "Dwemer",
        damageBonus: 1,
        averagePrice: 500
    },
    {
        name: "Daedric",
        attackBonus: 2,
        damageBonus: 3,
        averagePrice: 40000
    }
]

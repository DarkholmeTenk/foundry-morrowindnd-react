export interface AlchemyEffectPotion {
    dc: number,
    uuid: UUID
}

export interface AlchemyEffect {
    id: string,
    name: string,
    image: string | undefined,
    potions: AlchemyEffectPotion[]
}

export function AlchemyEffectImage({effect: {name, image}}: {effect: AlchemyEffect}) {
    if(!image) return null
    return <img src={image} alt={name} width="24" height="24" />
}
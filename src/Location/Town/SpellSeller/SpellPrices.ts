let prices = {
    1: 80,
    2: 250,
    3: 1000,
    4: 3000,
    5: 7000,
    6: 12000,
    7: 20000,
    8: 35000,
    9: 60000
}

export function calculatePrice(spellLevel: number, spell: Item, buyer: Actor): number {
    let basePrice = prices[spellLevel]  || prices[9]

    return basePrice
}
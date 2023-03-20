import getFlag from "../../Util/Helper/FlagHelper";

export const TokenLootGeneratorFlagKey = "TokenLootGenerator"

export interface TokenLootFlagData {
    rollTableIds: {id: UUID, qty: string}[]
}

export function getTokenLootGeneratorFlag(actor: Actor5e) {
    return getFlag<TokenLootFlagData>(actor, TokenLootGeneratorFlagKey, {rollTableIds: []})
}
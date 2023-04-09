import getFlag from "Util/Helper/FlagHelper";

export const TokenLootGeneratorFlagKey = "TokenLootGenerator"

export interface RollTableChoice {id: UUID | undefined, qty: string}
export interface TokenLootFlagData {
    rollTableIds: RollTableChoice[]
}

export function getTokenLootGeneratorFlag(actor: Actor5e) {
    return getFlag<TokenLootFlagData>(actor, TokenLootGeneratorFlagKey, {rollTableIds: []})
}
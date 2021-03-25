export function isActorMerchant(actor: Actor): Boolean {
    return actor.isToken &&
        actor.sheet.constructor.name === "LootSheet5eNPC" &&
        actor.getFlag("lootsheetnpc5e", "lootsheettype") === "MerchantSheet"
}
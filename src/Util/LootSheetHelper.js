export function isActorMerchant(actor) {
    return actor.isToken &&
        actor.sheet.constructor.name === "LootSheet5eNPC" &&
        actor.getFlag("lootsheetnpc5e", "lootsheettype") === "Merchant";
}

import {BasicSatchel, DefaultSatchelFlag} from "Systems/Satchels/Base/BasicSatchel";
import {AlchemyIngredientDefinition} from "Systems/Crafting/Alchemy/Model/AlchemyIngredientDefinition";
import {AlchemyRegistry} from "Systems/Crafting/Alchemy/Config/AlchemySetting";
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";

export class AlchemySatchel extends BasicSatchel<AlchemyIngredientDefinition> {
    constructor(item: Item5e) {
        super(item, AlchemyRegistry);
    }

    static getSatchels(actor: Actor5e): AlchemySatchel[] {
        return actor.items.map(x=>new AlchemySatchel(x))
            .filter(x=>x.hasFlag)
    }

    static async addSatchel(actor: Actor5e): Promise<AlchemySatchel> {
        let definition = AlchemyRegistry.satchelDefinition
        let item = await Item.create({
            name: definition.name,
            img: definition.image,
            type: "backpack",
            system: {
                price: {value: definition.baseValue, denomination: "gp"},
                weight: definition.baseWeight
            },
            flags: {
                [FLAG_SCOPE]: {
                    ["satchel_" + AlchemyRegistry.flagId]: DefaultSatchelFlag
                }
            }
        }, {parent: actor})
        return new AlchemySatchel(item)
    }
}
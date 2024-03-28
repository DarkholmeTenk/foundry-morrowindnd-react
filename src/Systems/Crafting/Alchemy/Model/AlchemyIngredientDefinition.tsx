import {BasicSatchelItemDefinition} from "Systems/Satchels/Base/BasicSatchelItem";

export interface AlchemyIngredientDefinition extends BasicSatchelItemDefinition {
    effects: string[]
}
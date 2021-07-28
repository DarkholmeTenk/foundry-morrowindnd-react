import {usePromise} from "../../../Util/Helper/PromiseHelper";
import {getIngredients} from "../../../Item/Alchemy/Ingredient/AlchemyIngredientFlag";
import {CircularProgress} from "@material-ui/core";
import {getActorItems} from "../../../Util/Helper/ItemHelper";
import {AlchemyCraftingSheet} from "./AlchemyCraftingSheet";

export default function AlchemyCraftingCoordinator({self}) {
    let {result: items, loading} = usePromise(async ()=>getActorItems(self), [self])
    if(items && !loading) {
        let ingredients = getIngredients(items)
        return <AlchemyCraftingSheet ingredients={ingredients} self={self} />
    } else {
        return <CircularProgress />
    }
}
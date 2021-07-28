import {IngredientData} from "../../../Item/Alchemy/Ingredient/AlchemyIngredientFlag";
import {useState} from "react";
import AlchemyEffectList from "./AlchemyEffectList";
import ItemViewer from "../../../Util/Components/ItemViewer";

interface Args {
    ingredients: IngredientData[],
    self: Actor<any, Item<any>>
}
export function AlchemyCraftingSheet({ingredients, self}: Args) {
    let [filter, setFilter] = useState("")
    let filterResult = ingredients.filter(ing=>filter === "" || ing.flag.effects.some(e=>e.id === filter))
    let items = filterResult.map(x=><ItemViewer item={x.item} />)
    return <div className="flexrow">
        <div style={{flexGrow: 0, borderRight: "1px solid gray", height: "100%"}}>
            <AlchemyEffectList ingredients={ingredients} filteredTo={filter} setFilteredTo={setFilter} />
        </div>
        <div className="flexcol" style={{flexGrow: 1}}>
            {items}
        </div>
    </div>
}
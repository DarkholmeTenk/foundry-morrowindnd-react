import {IngredientData} from "../../../Item/Alchemy/Ingredient/AlchemyIngredientFlag";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {getAlchemyEffect} from "../../../Item/Alchemy/AlchemyEffects/AlchemyEffectHelper";
import {useCallback} from "react";

function TypeControl({type, types}) {
    let typeInfo = getAlchemyEffect(type)!
    return <FormControlLabel control={<Radio size="small"/>} label={typeInfo.label} disabled={types[type] <= 1} value={type} />
}

interface Args {
    ingredients: IngredientData[],
    filteredTo: string,
    setFilteredTo: (filter: string)=>void
}
export default function AlchemyEffectList({ingredients, filteredTo, setFilteredTo}: Args) {
    let types: {[key: string]: number} = {}
    ingredients.forEach(item=>item.flag.effects.forEach(effect=>types[effect.id] = (types[effect.id] || 0) + 1))
    let eachOne = Object.keys(types).map(type=><TypeControl type={type} types={types} key={type} /> )
    let setFilter = useCallback((e)=>setFilteredTo(e.target.value === filteredTo ? null : e.target.value), [setFilteredTo, filteredTo])
    return <RadioGroup value={filteredTo} onChange={setFilter} >
        <FormControlLabel control={<Radio size="small" />} label="" value="" />
        {eachOne}
    </RadioGroup>
}
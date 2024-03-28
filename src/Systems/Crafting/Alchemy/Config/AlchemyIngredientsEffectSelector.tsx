import {StateSetter} from "Util/React/update/Updater";
import {useArrayAdder, useArrayRemover} from "Util/Helper/ArrayReducers";
import {AlchemyEffect, AlchemyEffectImage} from "Systems/Crafting/Alchemy/Model/AlchemyEffect";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {DeleteIcon, TakeIcon} from "Util/Components/SimpleComponents/IconLibrary";
import Styles from "./AlchemySettingEditor.module.scss"

interface Props {
    effects: AlchemyEffect[],
    ingredientEffects: string[],
    setIngredientEffects: StateSetter<string[]>
}
export function AlchemyIngredientsEffectSelector({effects, ingredientEffects, setIngredientEffects}: Props) {
    let adder = useArrayAdder(setIngredientEffects)
    let remover = useArrayRemover(setIngredientEffects)
    return <div className={Styles.EffectSplit}>
        <div>
            <h3>Added</h3>
            {ingredientEffects.map((e, i)=>{
                let eff = effects.find(y=>y.id === e)
                if(!eff) return null
                return <span key={eff.id}>
                    <AlchemyEffectImage effect={eff} />
                    {eff.name}
                    <Button onClick={()=>remover(i)} icon={DeleteIcon} />
                </span>
            })}
        </div>
        <div>
            <h3>Available</h3>
            {effects.filter(e=>!ingredientEffects.some(x=>x === e.id)).map((e)=>{
                return <span key={e.id}>
                    <AlchemyEffectImage effect={e} />
                    {e.name}
                    <Button onClick={()=>adder(e.id)} icon={TakeIcon} />
                </span>
            })}
        </div>
    </div>
}
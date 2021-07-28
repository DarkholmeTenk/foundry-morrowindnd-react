import {IngredientData} from "./AlchemyIngredientFlag";
import {getAlchemyEffect} from "../AlchemyEffects/AlchemyEffectHelper";
import AlchemyEffectViewer from "../AlchemyEffects/AlchemyEffectViewer";

interface AlchemyIngredientViewerArgs {
    data: IngredientData
}
export default function AlchemyIngredientViewer({data}: AlchemyIngredientViewerArgs) {
    let effects = (data.flag?.effects || []).map(x=>({effect: getAlchemyEffect(x.id), ...x})).filter(y=>y.effect)
    if(effects.length == 0) {
        return null
    } else {
        let map = effects.map(y=><AlchemyEffectViewer id={y.id} key={y.id} />)
        return <div>
            {map}
        </div>
    }
}
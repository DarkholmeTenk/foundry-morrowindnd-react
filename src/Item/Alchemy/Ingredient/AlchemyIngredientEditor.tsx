import {AlchemyIngredientEffect, AlchemyIngredientFlag} from "./AlchemyIngredientFlag";
import ArrayHelper, {ArrayFunctionArgs} from "../../../Util/Components/ArrayHelper";
import {useCallback} from "react";
import {TextField} from "@material-ui/core";
import Selector from "../../../Util/Components/Selector";
import {RegularSettings} from "../../../Settings/Settings";

function getEffectLabel(e) {
    return e.label
}

function AlchemyIngredientEffectEditor({value, setValue}: ArrayFunctionArgs<AlchemyIngredientEffect>) {
    let setEffect = useCallback((effect)=>setValue({...value, id: effect.id}), [value, setValue])
    let setDcBonus = useCallback((e)=>{
        let bonus = parseInt(e.target.value)
        if(bonus != 0)
            setValue({...value, bonus})
        else
            setValue({...value, bonus: null})
    }, [value, setValue])
    return <div style={{display: "flex", flexDirection: "row"}}>
        <Selector values={RegularSettings.value.alchemy?.effects || []} value={value.id} setValue={setEffect} labelFunction={getEffectLabel} includeNull={false} label="Effect"/>
        <TextField value={value.bonus || 0} onChange={setDcBonus} label="DC Bonus" type="number" />
    </div>
}

interface AlchemyIngredientEditorArgs {
    flag?: AlchemyIngredientFlag,
    setFlag: (flag: AlchemyIngredientFlag)=>void
}
export function AlchemyIngredientEditor({flag, setFlag}: AlchemyIngredientEditorArgs) {
    let setEffects = useCallback((effects)=>setFlag({...(flag || {}), effects}), [flag, setFlag])
    return <div>
        Effects:
        <ArrayHelper value={flag?.effects || []} setValue={setEffects} component={AlchemyIngredientEffectEditor} newValueGetter={{id: "", bonus: 0}} label="Effect" />
    </div>
}
import {AlchemySettings} from "./AlchemySettings";
import {AlchemyEffectsEditor} from "./AlchemyEffects/AlchemyEffectEditor";
import {useCallback} from "react";

interface AlchemySettingsEditorArgs {
    value: AlchemySettings
    setValue: (newValue: AlchemySettings)=>void
}
export default function AlchemySettingsEditor({value, setValue}: AlchemySettingsEditorArgs) {
    let setEffects = useCallback((v)=>setValue({...value, effects: v}), [value, setValue])
    return <div>
        <AlchemyEffectsEditor effects={value.effects} setEffects={setEffects} />
    </div>
}
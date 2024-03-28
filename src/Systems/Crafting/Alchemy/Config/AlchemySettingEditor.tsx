import {AlchemySettingData} from "Systems/Crafting/Alchemy/Config/AlchemySetting";
import {StateSetter, useMappedSetter} from "Util/React/update/Updater";
import {LeftPane, LeftPaneList, MainPane, PaneView} from "Util/Components/Layout/Panes";
import {useState} from "react";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {AlchemySatchelEditor} from "Systems/Crafting/Alchemy/Config/AlchemySatchelEditor";
import {AlchemyIngredientsEditor} from "Systems/Crafting/Alchemy/Config/AlchemyIngredientsEditor";
import {AlchemyEffectsEditor} from "Systems/Crafting/Alchemy/Config/AlchemyEffectsEditor";

type View = "satchel" | "effects" | "ingredients"
interface Props {
    state: AlchemySettingData,
    setState: StateSetter<AlchemySettingData>
    save: ()=>void
    canSave: boolean
}
export function AlchemySettingEditor({state, setState, save, canSave}: Props) {
    let [view, setView] = useState<View>("satchel")
    let setSatchel = useMappedSetter("satchelDefinition", setState)
    let setEffects = useMappedSetter("effects", setState)
    let setIngredients = useMappedSetter("items", setState)
    return <PaneView>
        <LeftPane>
            <LeftPaneList>
                <li><Button onClick={()=>setView("satchel")}>Satchel</Button></li>
                <li><Button onClick={()=>setView("effects")}>Effects</Button></li>
                <li><Button onClick={()=>setView("ingredients")}>Ingredients</Button></li>
            </LeftPaneList>
            <Button onClick={save} disabled={!canSave}>Save</Button>
        </LeftPane>
        {view === "satchel" && <AlchemySatchelEditor value={state.satchelDefinition} setValue={setSatchel} />}
        {view === "effects" && <AlchemyEffectsEditor value={state.effects} setValue={setEffects} />}
        {view === "ingredients" && <AlchemyIngredientsEditor effects={state.effects} value={state.items} setValue={setIngredients} />}
    </PaneView>
}
import {StateSetter, useMappedSetter} from "Util/React/update/Updater";
import {LeftPane, MainPane} from "Util/Components/Layout/Panes";
import {AlchemyIngredientDefinition} from "Systems/Crafting/Alchemy/Model/AlchemyIngredientDefinition";
import {useState} from "react";
import {Updater, useArrayUpdater} from "Util/Helper/ArrayReducers";
import {getFieldData} from "Util/Components/Input/FieldData";
import {FloatField, StringField} from "Util/Components/Input/InputField";
import {ImageField} from "Util/Components/Input/ImageField";
import {LeftPaneEditorList, LeftPaneImageDecorator} from "Util/Components/Layout/LeftPaneEditorList";
import {LabeledField} from "Util/Components/Input/LabeledField";
import {AlchemyIngredientsEffectSelector} from "Systems/Crafting/Alchemy/Config/AlchemyIngredientsEffectSelector";
import {AlchemyEffect} from "Systems/Crafting/Alchemy/Model/AlchemyEffect";
import {SplitTypeSelector} from "Util/Components/Input/SplitTypeSelector";

function newDefinition(): AlchemyIngredientDefinition {
    return {
        id: randomID(),
        name: "My New Ingredient",
        image: undefined,
        weight: 0,
        value: 0,
        effects: []
    }
}

interface AlchemyIngredientEditorProps {
    effects: AlchemyEffect[]
    value: AlchemyIngredientDefinition,
    updater: Updater<AlchemyIngredientDefinition>,
    index: number
}
function AlchemyIngredientEditor({effects, value, updater, index}: AlchemyIngredientEditorProps) {
    let setValue: StateSetter<AlchemyIngredientDefinition> = (x)=>updater(index, x)
    let fields = getFieldData(value, setValue)
    let setEffects = useMappedSetter("effects", setValue)
    return <>
        <StringField {...fields.get("name")} />
        <ImageField {...fields.get("image")} />
        <FloatField {...fields.get("value")} />
        <FloatField {...fields.get("weight")} />
        <LabeledField label={"effects"}>
            <SplitTypeSelector potential={effects} selected={value.effects} setSelected={setEffects} />
        </LabeledField>
    </>
}

interface Props {
    effects: AlchemyEffect[]
    value: AlchemyIngredientDefinition[]
    setValue: StateSetter<AlchemyIngredientDefinition[]>
}
export function AlchemyIngredientsEditor({effects, value, setValue}: Props) {
    let [editing, setEditing] = useState<string | undefined>()
    let update = useArrayUpdater(setValue)
    let editingIndex = editing ? value.findIndex(x=>x.id === editing) : -1
    return <>
        <LeftPane>
            <h3>Ingredients</h3>
            <LeftPaneEditorList list={value} set={setValue} editing={editing} setEditing={setEditing} addNew={newDefinition} decorator={LeftPaneImageDecorator}/>
        </LeftPane>
        <MainPane>
            {editing && editingIndex >= 0 && <AlchemyIngredientEditor key={editing} effects={effects} value={value[editingIndex]} updater={update} index={editingIndex} />}
        </MainPane>
    </>
}
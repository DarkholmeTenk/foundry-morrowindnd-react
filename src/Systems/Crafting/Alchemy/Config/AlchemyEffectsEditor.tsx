import {StateSetter, useMappedSetter} from "Util/React/update/Updater";
import {LeftPane, MainPane} from "Util/Components/Layout/Panes";
import {AlchemyIngredientDefinition} from "Systems/Crafting/Alchemy/Model/AlchemyIngredientDefinition";
import {useState} from "react";
import {Updater, useArrayUpdater} from "Util/Helper/ArrayReducers";
import {getFieldData} from "Util/Components/Input/FieldData";
import {FloatField, StringField} from "Util/Components/Input/InputField";
import {ImageField} from "Util/Components/Input/ImageField";
import {LeftPaneEditorList, LeftPaneImageDecorator} from "Util/Components/Layout/LeftPaneEditorList";
import {AlchemyEffect} from "Systems/Crafting/Alchemy/Model/AlchemyEffect";
import {LabeledField} from "Util/Components/Input/LabeledField";
import {AlchemyEffectPotionsEditor} from "Systems/Crafting/Alchemy/Config/AlchemyEffectPotionsEditor";

function newEffect(): AlchemyEffect {
    return {
        id: randomID(),
        name: "My New Effect",
        image: undefined,
        potions: []
    }
}

interface AlchemyEffectEditorProps {
    value: AlchemyEffect,
    updater: Updater<AlchemyEffect>,
    index: number
}
function AlchemyEffectEditor({value, updater, index}: AlchemyEffectEditorProps) {
    let setValue = updater.forSlot(index)
    let fields = getFieldData(value, setValue)
    let setPotions = useMappedSetter("potions", setValue)
    return <>
        <StringField {...fields.get("name")} />
        <ImageField {...fields.get("image")} />
        <LabeledField label={"potions"}>
            <AlchemyEffectPotionsEditor potions={value.potions} setPotions={setPotions} />
        </LabeledField>
    </>
}

export function AlchemyEffectsEditor({value, setValue}: {value: AlchemyEffect[], setValue: StateSetter<AlchemyEffect[]>}) {
    let [editing, setEditing] = useState<string | undefined>()
    let update = useArrayUpdater(setValue)
    let editingIndex = editing ? value.findIndex(x=>x.id === editing) : -1
    return <>
        <LeftPane>
            <h3>Effects</h3>
            <LeftPaneEditorList list={value} set={setValue} editing={editing} setEditing={setEditing} addNew={newEffect} decorator={LeftPaneImageDecorator}/>
        </LeftPane>
        <MainPane>
            {editing && editingIndex >= 0 && <AlchemyEffectEditor key={editing} value={value[editingIndex]} updater={update} index={editingIndex} />}
        </MainPane>
    </>
}
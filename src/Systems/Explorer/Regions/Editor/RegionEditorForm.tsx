import {useArrayUpdater} from "Util/Helper/ArrayReducers";
import {RegionType} from "Systems/Explorer/Regions/SceneRegionFlag";
import {StateSetter, useMappedSetter, useSafeSetter} from "Util/React/update/Updater";
import Styles from "Systems/Explorer/Regions/Editor/RegionEditor.module.scss";
import {getFieldData} from "Util/Components/Input/FieldData";
import {StringField} from "Util/Components/Input/InputField";
import {ColorField} from "Util/Components/Input/ColorField";
import {SplitTypeSelector} from "Util/Components/Input/SplitTypeSelector";
import {AlchemyRegistry, AlchemySetting} from "Systems/Crafting/Alchemy/Config/AlchemySetting";
import {LabeledField} from "Util/Components/Input/LabeledField";

interface FormProps {
    region: RegionType,
    setRegion: StateSetter<RegionType>,
    clear: () => void
}

function RegionEditorForm({region, setRegion, clear}: FormProps) {
    let fields = getFieldData(region, setRegion)
    let setIngredients = useSafeSetter(useMappedSetter("ingredients", setRegion), [] as string[])
    return <div>
        <StringField {...fields.get("name")} />
        <ColorField {...fields.get("color")} />
        <LabeledField label="Ingredients">
            <SplitTypeSelector potential={AlchemySetting.value.items} selected={region.ingredients || []} setSelected={setIngredients} />
        </LabeledField>
    </div>
}

interface FormWrapProps {
    regions: RegionType[],
    setter: StateSetter<RegionType[]>
    editing: string,
    clear: () => void
}

export function RegionEditorFormWrap({regions, setter, editing, clear}: FormWrapProps) {
    let updater = useArrayUpdater(setter)
    let index = regions.findIndex(x => x.id === editing)
    if (index === -1) return null
    return <RegionEditorForm region={regions[index]} setRegion={x => updater(index, x)} clear={clear}/>
}
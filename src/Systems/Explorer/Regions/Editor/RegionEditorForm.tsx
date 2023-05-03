import {useArrayUpdater} from "Util/Helper/ArrayReducers";
import {RegionType} from "Systems/Explorer/Regions/SceneRegionFlag";
import {StateSetter} from "Util/React/update/Updater";
import Styles from "Systems/Explorer/Regions/Editor/RegionEditor.module.scss";
import {getFieldData} from "Util/Components/Input/FieldData";
import {StringField} from "Util/Components/Input/InputField";
import {ColorField} from "Util/Components/Input/ColorField";

interface FormProps {
    region: RegionType,
    setRegion: StateSetter<RegionType>,
    clear: () => void
}

function RegionEditorForm({region, setRegion, clear}: FormProps) {
    let fields = getFieldData(region, setRegion)
    return <div>
        <StringField {...fields.get("name")} />
        <ColorField {...fields.get("color")} />
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
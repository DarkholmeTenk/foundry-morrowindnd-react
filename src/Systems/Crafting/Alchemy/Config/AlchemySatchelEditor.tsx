import {SatchelDefinition} from "Systems/Satchels/Base/BasicSatchelRegistry";
import {StateSetter} from "Util/React/update/Updater";
import {getFieldData} from "Util/Components/Input/FieldData";
import {IntField, StringField} from "Util/Components/Input/InputField";
import {MainPane} from "Util/Components/Layout/Panes";
import {ImageField} from "Util/Components/Input/ImageField";

export function AlchemySatchelEditor({value, setValue}: {value: SatchelDefinition, setValue: StateSetter<SatchelDefinition>}) {
    let fields = getFieldData(value, setValue)
    return <MainPane>
        <StringField {...fields.get("name")} />
        <ImageField {...fields.get("image")} />
        <IntField {...fields.get("baseWeight")} />
        <IntField {...fields.get("baseValue")} />
    </MainPane>
}
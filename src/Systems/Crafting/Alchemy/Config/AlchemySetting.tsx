import {
    BasicSatchelRegistrySettingData,
    SatchelDefinition,
    SettingSatchelRegistry
} from "Systems/Satchels/Base/BasicSatchelRegistry";
import {AlchemyIngredientDefinition} from "Systems/Crafting/Alchemy/Model/AlchemyIngredientDefinition";
import {SettingProp, setupSettingMenu} from "Settings/SettingMenu";
import {useSavableData} from "Util/Helper/useSavableData";
import {AlchemySettingEditor} from "Systems/Crafting/Alchemy/Config/AlchemySettingEditor";

export interface AlchemySettingData extends BasicSatchelRegistrySettingData<AlchemyIngredientDefinition> {
    effects: any[]
}
const Default: AlchemySettingData = {
    satchelDefinition: {
        image: "",
        name: "Alchemy Satchel",
        baseValue: 0,
        baseWeight: 0
    },
    items: [],
    effects: []
}

function AlchemySettingComponent({setting}: SettingProp<AlchemySettingData>) {
    let [store, setStore, save, canSave] = useSavableData(setting.value, (x)=> { setting.value = x })
    return <AlchemySettingEditor state={store} setState={setStore} save={save} canSave={canSave} />
}

export const AlchemySetting = setupSettingMenu<AlchemySettingData>({
    key: "alchemy",
    label: "Alchemy",
    name: "Alchemy",
    scope: "world",
    type: AlchemySettingComponent,
    restricted: true,
    default: Default,
    sheetOptions: {
        width: 1200,
        height: 800
    }
})

export function AnywhereAlchemySettingMenu() {
    return <AlchemySettingComponent setting={AlchemySetting} />
}

export const AlchemyRegistry = new SettingSatchelRegistry(AlchemySetting)
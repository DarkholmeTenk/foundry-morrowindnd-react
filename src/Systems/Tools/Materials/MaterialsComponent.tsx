import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import {loadPack} from "Util/Identifiers/PackHelper";
import {ItemPackSetting} from "Systems/RollTable/Rolling/Settings";
import {isItem} from "Util/Identifiers/UuidHelper";
import ItemViewer from "Util/Components/ItemViewer/ItemViewer";

function isEquipment(i: any): i is ItemEquipment {
    return isItem(i) && i.type === "equipment"
}

export function MaterialsComponent() {
    let packData = useSuspensePromise("items", ()=>loadPack(ItemPackSetting.value, isEquipment))
    return <div>
        WIPWIPWIPWIP
        {packData.map((i)=><ItemViewer item={i} key={i.id} />)}
    </div>
}
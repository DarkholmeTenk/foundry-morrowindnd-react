import {StoredSellable} from "Sheet/MerchantSheet/MerchantInventory/Settings";
import {StateSetter} from "Util/React/update/Updater";
import {useNestedMISSetter} from "Sheet/MerchantSheet/MerchantInventory/Config/NestedSetter";
import {
    MerchantInventorySource, MerchantInventorySourcePackFilter,
    MerchantInventorySourceSimple, ReferencedMerchantInventorySource
} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";
import {ReactNode} from "react";
import {MISEditorSimple} from "Sheet/MerchantSheet/MerchantInventory/Config/MISEditorSimple";
import {MISEditorFilter} from "Sheet/MerchantSheet/MerchantInventory/Config/MISEditorFilter";
import {MISEditorReferenced} from "Sheet/MerchantSheet/MerchantInventory/Config/MISEditorReferenced";

export interface MISEditorProps<T extends MerchantInventorySource> {
    value: T
    setValue: StateSetter<T>
}
interface EditorSet<T extends MerchantInventorySource> {
    MainPane: (props: MISEditorProps<T>)=>ReactNode
    RightPane?: (props: MISEditorProps<T>)=>ReactNode
}
type Editable = MerchantInventorySourceSimple | MerchantInventorySourcePackFilter | ReferencedMerchantInventorySource
const Editors: {[key in Editable['type']]: EditorSet<MerchantInventorySource & {type: key}>} = {
    "simple": {
        MainPane: MISEditorSimple
    },
    "filter": {
        MainPane: MISEditorFilter
    },
    "referenced": {
        MainPane: MISEditorReferenced
    }
}

interface Props {
    sellables: StoredSellable
    setSellable: StateSetter<StoredSellable>
    id: string
    partKey: string
}
export function SingleMerchantInventorySourceEditor({sellables, setSellable, id, partKey}: Props) {
    let myParts = useNestedMISSetter(sellables, setSellable, id, partKey)
    if(myParts === null) return null
    let [myPart, setMyPart] = myParts
    const {MainPane, RightPane} = Editors[myPart.type]
    return <div>
        <div>
            {partKey}
            <MainPane value={myPart} setValue={setMyPart} />
        </div>
        <div>
            {RightPane && <RightPane value={myPart} setValue={setMyPart} /> }
        </div>
    </div>
}
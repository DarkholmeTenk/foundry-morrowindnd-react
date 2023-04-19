import {StoredSellable} from "Sheet/MerchantSheet/MerchantInventory/Settings";
import {StateSetter} from "Util/React/update/Updater";
import {useNestedMISSetter} from "Sheet/MerchantSheet/MerchantInventory/Config/NestedSetter";
import {
    MerchantInventorySource, MerchantInventorySourcePackFilter,
    MerchantInventorySourceSimple, ReferencedMerchantInventorySource
} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";
import {ChangeEvent, ReactNode} from "react";
import {MISEditorSimple} from "Sheet/MerchantSheet/MerchantInventory/Config/MISEditorSimple";
import {MISEditorFilter, MISEditorFilterRightPane} from "Sheet/MerchantSheet/MerchantInventory/Config/MISEditorFilter";
import {MISEditorReferenced} from "Sheet/MerchantSheet/MerchantInventory/Config/MISEditorReferenced";
import Styles from "./SellableSourceEditor.module.scss"
import {SuspenseLayer} from "Util/Suspense/SuspenseLoadIndicator";

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
        MainPane: MISEditorFilter,
        RightPane: MISEditorFilterRightPane
    },
    "referenced": {
        MainPane: MISEditorReferenced
    }
}

function QtyEditor({source, setSource}: {source: MerchantInventorySource, setSource: StateSetter<MerchantInventorySource>}) {
    if(source.type !== "simple" && source.type !== "filter") return null
    let onChange = (e: ChangeEvent<HTMLInputElement>) => {
         let num = e.target.valueAsNumber
        if(!num || isNaN(num) || num < 1) return
        setSource(old=>({...old, qty: Math.floor(num)}))
    }
    return <div>
        <label>Qty</label>
        <input value={source.qty ?? 1} type="number" onChange={onChange} />
    </div>
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
    return <>
        <div className={Styles.MainPane}>
            {partKey}
            <div className={Styles.Contents}>
                <SuspenseLayer>
                    <MainPane value={myPart} setValue={setMyPart} />
                </SuspenseLayer>
            </div>
            <QtyEditor source={myPart} setSource={setMyPart} />
        </div>
        {RightPane && <div className={Styles.RightPane}>
            <div className={Styles.Contents}>
                <SuspenseLayer>
                    <RightPane value={myPart} setValue={setMyPart} />
                </SuspenseLayer>
            </div>
        </div>}
    </>
}
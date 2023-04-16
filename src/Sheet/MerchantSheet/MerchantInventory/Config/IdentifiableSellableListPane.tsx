import {IdentifiableSellable, StoredSellable} from "Sheet/MerchantSheet/MerchantInventory/Settings";
import {
    MerchantInventorySource,
    NestedMerchantInventorySource
} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";
import Styles from "./SellableSourceEditor.module.scss"
import {Button, TwoPressButton} from "Util/Components/SimpleComponents";
import {StateSetter, useMappedSetter, useSetter} from "Util/React/update/Updater";
import {Remover, Updater, useArrayReducers} from "Util/Helper/ArrayReducers";

interface ListRowProps {
    sellable: MerchantInventorySource,
    index: number
    update: Updater<MerchantInventorySource>,
    remove: Remover
    setEditingPart: (id: string)=>void
    keySoFar: string
}
function NestedIdentifiableListRow({sellable, index, update, remove, keySoFar, setEditingPart}: ListRowProps) {
    if(sellable.type === "nested") {
        return <NestedIdentifiableNestedListRow keySoFar={keySoFar} sellable={sellable} setEditingPart={setEditingPart} index={index} update={update} remove={remove} />
    }
    return <div>
        {sellable.type}
        <Button onClick={()=>setEditingPart(keySoFar + index)} icon="fas fa-pen-to-square" />
        <TwoPressButton onClick={()=>remove(index)} icon="fas fa-trash" />
    </div>
}
function NestedIdentifiableNestedListRow({sellable, index, update, remove, keySoFar, setEditingPart}: ListRowProps & {sellable: NestedMerchantInventorySource}) {
    let setter = useSetter(sellable.sellables, (v)=>{
        update(index, oldValue=>({
            type: "nested",
            sellables: v
        }))
    })
    return <NestedIdentifiableList keySoFar={keySoFar + index+"."} sellables={sellable.sellables} setEditingPart={setEditingPart} setSellables={setter} deleteMe={()=>remove(index)} />
}

interface ListProps {
    sellables: MerchantInventorySource[]
    setSellables: StateSetter<MerchantInventorySource[]>
    keySoFar: string
    setEditingPart: (id: string | undefined)=>void
    deleteMe?: (()=>void)
}
function NestedIdentifiableList({sellables, setSellables, deleteMe, keySoFar, setEditingPart}: ListProps) {
    let [update, add, remove] = useArrayReducers(setSellables)
    return <div>
        <div className={Styles.Title}>
            <span>Nested</span>
            <span>
                <Button onClick={()=>add({type: "simple", itemIds: []})} icon="fas fa-boxes-stacked" data-tooltip="test" />
                <Button onClick={()=>add({type: "nested", sellables: []})} icon="fas fa-folder-tree" data-tooltip="test" />
                <Button onClick={()=>add({type: "referenced", merchantInventoryId: undefined})} icon="fas fa-hand-pointer" data-tooltip="test" />
                <Button onClick={()=>add({type: "filter", filter: ""})} icon="fas fa-filter" data-tooltip="test" />
                {deleteMe && <TwoPressButton onClick={deleteMe} icon="fas fa-trash" />}
            </span>
        </div>
        <div className={Styles.Nesting}>
            {sellables.map((x, i)=><NestedIdentifiableListRow setEditingPart={setEditingPart} keySoFar={keySoFar} sellable={x} index={i} update={update} remove={remove} key={i}/>)}
        </div>
    </div>
}

interface Props {
    sellable: IdentifiableSellable
    setSellables: StateSetter<StoredSellable>
    setEditingPart: (id: string | undefined)=>void
    setEditingIdentifiable: (id: undefined)=>void
}
export function IdentifiableSellableListPane({sellable, setSellables, setEditingPart, setEditingIdentifiable}: Props) {
    let mapped = useMappedSetter(sellable.name, setSellables)
    let xMapped = useMappedSetter("sellables", mapped)
    return <div className={Styles.IdentifiableSellableList}>
        <div className={Styles.Title}>
            <h3>{sellable.name}</h3>
            <Button onClick={()=>setEditingIdentifiable(undefined)} icon="fas fa-xmark" />
        </div>
        <div className={Styles.List}>
            <NestedIdentifiableList keySoFar="" sellables={sellable.sellables} setEditingPart={setEditingPart} setSellables={xMapped} />
        </div>
    </div>
}
import {StoredSellable} from "Sheet/MerchantSheet/MerchantInventory/Settings";
import {callUpdater, StateSetter, useMappedSetter} from "Util/React/update/Updater";
import {MerchantInventorySource} from "Sheet/MerchantSheet/MerchantInventory/Config/MerchantInventoryConfigData";

export function useNestedMISSetter(sellables: StoredSellable, setSellables: StateSetter<StoredSellable>, rootId: string, next: string): null | [MerchantInventorySource, StateSetter<MerchantInventorySource>]  {
    let root = sellables[rootId]
    let setRoot = useMappedSetter(rootId, setSellables)
    let parts = next.split(".")
    let setterSoFar: StateSetter<MerchantInventorySource> = setRoot
    let valueSoFar: MerchantInventorySource = root
    for(let index of parts){
        if(!valueSoFar || valueSoFar.type !== "nested") {
            return null
        }
        valueSoFar = valueSoFar.sellables[index]
        let v = setterSoFar
        setterSoFar = (newChild)=>{
            v(oldParent=>{
                if(oldParent.type !== "nested") return oldParent
                let newParent = {...oldParent, sellables: [...oldParent.sellables]}
                newParent.sellables[index] = callUpdater(oldParent.sellables[index], newChild)
                return newParent
            })
        }
    }
    if(!valueSoFar || valueSoFar.type === "nested") return null
    return [valueSoFar, setterSoFar]
}
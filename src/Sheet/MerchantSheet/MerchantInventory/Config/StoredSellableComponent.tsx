import React, {createContext, useMemo, useState} from "react";
import {Card, CardActions, CardContent, TextField} from "@mui/material";
import SellableSourceEditor from "Sheet/MerchantSheet/MerchantInventory/Config/SellableSourceEditor";
import {StoredSellable} from "Sheet/MerchantSheet/MerchantInventory/Settings";
import {useSavableData} from "Util/Helper/useSavableData";
import {StoredSellableList} from "Sheet/MerchantSheet/MerchantInventory/Config/StoredSellableList";
import Styles from "./SellableSourceEditor.module.scss"
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {IdentifiableSellableListPane} from "Sheet/MerchantSheet/MerchantInventory/Config/IdentifiableSellableListPane";
import {
    SingleMerchantInventorySourceEditor
} from "Sheet/MerchantSheet/MerchantInventory/Config/SingleMerchantInventorySourceEditor";
import {StateSetter} from "Util/React/update/Updater";

export const SellableSourceContext = createContext<any>({})

export const StoredSellableComponentOptions = {
    width: 1400,
    height: 700
}

function Editor({source, setSource, id, setId, commit}) {
    if(!source) {
        return null
    }
    return <Card>
        <CardContent>
            <TextField value={id} onChange={(e)=>setId(e.target.value)} />
            <SellableSourceEditor source={source} setSource={setSource} />
        </CardContent>
        <CardActions>
            <Button onClick={commit}>Commit</Button>
        </CardActions>
    </Card>
}

function sanitize(value: StoredSellable): StoredSellable {
    let x: StoredSellable = {}
    Object.keys(value).forEach(k=>{
        let v = value[k]
        if(v.type === "nested") x[k] = v
    })
    return x
}

interface Ctx {
    store: StoredSellable,
    setStore: StateSetter<StoredSellable>
    editing?: string
}
export const StoredSellableContext = createContext<Ctx>({} as Ctx)

interface Props {
    setting: { value: StoredSellable }
}
export default function StoredSellableComponent({setting}) {
    let [store, setStore, save, canSave] = useSavableData(sanitize(setting.value), (v)=>{ setting.value=v })
    let [editing, setEditing] = useState<string | undefined>()
    let [editingPart, setEditingPart] = useState<string | undefined>(undefined)
    let rSetEditing = (x)=>{
        setEditingPart(undefined)
        setEditing(x)
    }
    let v = useMemo(()=>({store, setStore, editing}), [store, setStore, editing])
    return <StoredSellableContext.Provider value={v}>
        <div className="flex-row" style={{height: "100%"}}>
            <div className={Styles.LeftPane}>
                <div className={Styles.Contents}>
                    {!editing && <StoredSellableList value={store} setValue={setStore} setEditing={rSetEditing} /> }
                    {editing && <IdentifiableSellableListPane sellable={store[editing]} setSellables={setStore} setEditingPart={setEditingPart} setEditingIdentifiable={rSetEditing} />}
                </div>
                <hr />
                <Button onClick={save} disabled={!canSave}>Save</Button>
            </div>
            <div className={Styles.PaneContainer}>
                {(editingPart && editing) ? <SingleMerchantInventorySourceEditor sellables={store} setSellable={setStore} id={editing} partKey={editingPart} /> : null }
            </div>
        </div>
    </StoredSellableContext.Provider>
}
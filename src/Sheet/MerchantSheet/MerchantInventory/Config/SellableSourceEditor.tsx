import {
    MerchantInventorySourcePackFilter,
    NestedMerchantInventorySource,
    ReferencedMerchantInventorySource,
    MerchantInventorySource,
    MerchantInventorySourceSimple
} from "./MerchantInventoryConfigData";
import React, {FunctionComponent, useContext} from "react";
import {usePromise} from "../../../../Util/Helper/PromiseHelper";
import ItemViewer from "../../../../Util/Components/ItemViewer/ItemViewer";
import {SellableSourceContext} from "../StoredSellableComponent";
import {Button, MenuItem, Select, TextField} from "@material-ui/core";
import {onItemDrop} from "../../../../Util/Helper/DropHelper";
import {loadItem} from "../../../../Util/Identifiers/UuidHelper";

function ReferencedSellableEditor({source, setSource}: SellableSourceEditorArgs<ReferencedMerchantInventorySource>) {
    let context = useContext(SellableSourceContext)
    let values = Object.keys(context).sort()
    let menuItems = values.map(v=><MenuItem key={v} value={v}>{v}</MenuItem>)
    return <div>
        Reference:
        <Select value={source.merchantInventoryId} onChange={(e)=>setSource({type: "referenced", merchantInventoryId: e.target.value as string})}>
            {menuItems}
        </Select>
    </div>
}

function NestedSellableEditor({source, setSource}: SellableSourceEditorArgs<NestedMerchantInventorySource>) {
    let subEditors = source.sellables.map((s,i)=>{
        return <div>
            <a onClick={()=>{
                let newOne = [...source.sellables]
                newOne.splice(i, 1)
                setSource({type: "nested", sellables: newOne})
            }}><i className="fas fa-trash"/></a>
            <SellableSourceEditor
                source={s}
                setSource={(n)=> {
                    let newOne = [...source.sellables]
                    newOne[i] = n
                    setSource({type: "nested", sellables: newOne})
                }}
            />
        </div>
    })
    let drop = onItemDrop((item)=>setSource({type: "nested", sellables: [...source.sellables, {type: "simple", itemId: item.uuid}]}))
    return <div style={{paddingLeft: '8px', borderLeft: '1px solid black'}} onDrop={drop}>
        Nested:
        {subEditors}
        <Button onClick={()=>setSource({type: "nested", sellables: [...source.sellables, {type: "simple", itemId: undefined}]})}>+</Button>
    </div>
}

function FilterSellableEditor({source, setSource}: SellableSourceEditorArgs<MerchantInventorySourcePackFilter>) {
    return <div>
        Filter
        <TextField value={source.filter} onChange={(e)=>setSource({type: "filter", filter: e.target.value as string})} />
    </div>
}

function SimpleSellableEditor({source, setSource}: SellableSourceEditorArgs<MerchantInventorySourceSimple>) {
    let drop = onItemDrop((item)=>{
        setSource({itemId: item.uuid, type: "simple"})
    })
    let {result, loading} = usePromise(async ()=>source.itemId ? loadItem(source.itemId) : null, [source.itemId])
    return <div onDrop={drop}>
        Item ID: {JSON.stringify(source.itemId)}
        {result ? <ItemViewer item={result} /> : null}
    </div>
}

const Editors : {[K in MerchantInventorySource["type"]]: FunctionComponent<SellableSourceEditorArgs<MerchantInventorySource & {type: K}>>} = {
    "simple": SimpleSellableEditor,
    "filter": FilterSellableEditor,
    "nested": NestedSellableEditor,
    "referenced": ReferencedSellableEditor
}

function EditorChild<K extends MerchantInventorySource>({source, setSource}: SellableSourceEditorArgs<K>) {
    let ChildObj = Editors[source.type] as FunctionComponent<SellableSourceEditorArgs<K>>
    if(!ChildObj) return <div>No type found</div>
    return <ChildObj source={source} setSource={setSource} />
}

const DefaultOptions: any[] = [
    {
        icon: <i className="fas fa-bowling-ball" />,
        setTo: {itemId: null}
    },
    {
        icon: <i className="fas fa-link" />,
        setTo: {sellableId: null}
    },
    {
        icon: <i className="fas fa-folder-open"/>,
        setTo: {sellables: []}
    },
    {
        icon: <i className="fas fa-filter"/>,
        setTo: {filter: ""}
    }
]

function SimpleIcon({setSource, icon, setTo}) {
    return <a className='control-icon' onClick={() => setSource(setTo)}>
        {icon}
    </a>
}

interface SellableSourceEditorArgs<X> {
    source: X
    setSource: (source: MerchantInventorySource)=>void
}
export default function SellableSourceEditor({source, setSource}: SellableSourceEditorArgs<MerchantInventorySource>) {
    let buttons = DefaultOptions.map((x, i)=> <SimpleIcon {...{setSource, ...x}}/> )
    return <div>
        <div className="flex-row">
            {buttons}
        </div>
        <div>
            <EditorChild source={source} setSource={setSource} />
        </div>
    </div>
}
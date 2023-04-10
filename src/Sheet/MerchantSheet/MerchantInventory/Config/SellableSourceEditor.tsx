import {
    MerchantInventorySource,
    MerchantInventorySourcePackFilter,
    MerchantInventorySourceSimple,
    NestedMerchantInventorySource,
    ReferencedMerchantInventorySource
} from "./MerchantInventoryConfigData";
import React, {FunctionComponent, ReactNode, useContext} from "react";
import ItemViewer from "../../../../Util/Components/ItemViewer/ItemViewer";
import {SellableSourceContext} from "../StoredSellableComponent";
import {Button, MenuItem, Select, TextField} from "@mui/material";
import {onItemDrop} from "Util/Helper/DropHelper";
import {loadItem} from "Util/Identifiers/UuidHelper";

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
    let drop = onItemDrop((item)=>setSource({type: "nested", sellables: [...source.sellables, {type: "simple", itemIds: [item.uuid]}]}))
    return <div style={{paddingLeft: '8px', borderLeft: '1px solid black'}} onDrop={drop}>
        Nested:
        {subEditors}
        <Button onClick={()=>setSource({type: "nested", sellables: [...source.sellables, {type: "simple", itemIds: []}]})}>+</Button>
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
        setSource({itemIds: [item.uuid], type: "simple"})
    })
    let result = source.itemIds.map(x=>loadItem.sync(x)).filter(x=>x) as Item5e[]
    return <div onDrop={drop}>
        Item ID: {JSON.stringify(source.itemIds)}
        {result.map(i=><ItemViewer key={i.uuid} item={i} />)}
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

interface DefaultOption {
    icon: ReactNode
    setTo: MerchantInventorySource
}
const DefaultOptions: DefaultOption[] = [
    {
        icon: <i className="fas fa-bowling-ball" />,
        setTo: {type: "simple", itemIds: []}
    },
    {
        icon: <i className="fas fa-link" />,
        setTo: {type: "referenced", merchantInventoryId: ""}
    },
    {
        icon: <i className="fas fa-folder-open"/>,
        setTo: {type: "nested", sellables: []}
    },
    {
        icon: <i className="fas fa-filter"/>,
        setTo: {type: "filter", filter: ""}
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
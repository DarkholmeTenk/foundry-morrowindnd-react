import {
    FilterSellable,
    isFilterSellable,
    isNestedSellable,
    isReferencedSellable,
    isSimpleSellable,
    NestedSellable,
    ReferencedSellable,
    SellableSource,
    SimpleSellable
} from "./SellableData";
import React, {useContext} from "react";
import {getItem, getItemId} from "../../../Util/Identifiers/ItemID";
import {usePromise} from "../../../Util/Helper/PromiseHelper";
import ItemViewer from "../../../Util/Components/ItemViewer";
import {SellableSourceContext} from "./StoredSellableComponent";
import {Button, MenuItem, Select, TextField} from "@material-ui/core";
import {onItemDrop} from "../../../Util/Helper/DropHelper";

function ReferencedSellableEditor({source, setSource}: SellableSourceEditorArgs<ReferencedSellable>) {
    let context = useContext(SellableSourceContext)
    let values = Object.keys(context).sort()
    let menuItems = values.map(v=><MenuItem key={v} value={v}>{v}</MenuItem>)
    return <div>
        Reference:
        <Select value={source.sellableId} onChange={(e)=>setSource({sellableId: e.target.value as string})}>
            {menuItems}
        </Select>
    </div>
}

function NestedSellableEditor({source, setSource}: SellableSourceEditorArgs<NestedSellable>) {
    let subEditors = source.sellables.map((s,i)=>{
        return <div>
            <a onClick={()=>{
                let newOne = [...source.sellables]
                newOne.splice(i, 1)
                setSource({sellables: newOne})
            }}><i className="fas fa-trash"/></a>
            <SellableSourceEditor
                source={s}
                setSource={(n)=> {
                    let newOne = [...source.sellables]
                    newOne[i] = n
                    setSource({sellables: newOne})
                }}
            />
        </div>
    })
    let drop = onItemDrop((item)=>setSource({sellables: [...source.sellables, {itemId: getItemId(item)}]}))
    return <div style={{paddingLeft: '8px', borderLeft: '1px solid black'}} onDrop={drop}>
        Nested:
        {subEditors}
        <Button onClick={()=>setSource({sellables: [...source.sellables, {itemId: undefined}]})}>+</Button>
    </div>
}

function FilterSellableEditor({source, setSource}: SellableSourceEditorArgs<FilterSellable>) {
    return <div>
        Filter
        <TextField value={source.filter} onChange={(e)=>setSource({filter: e.target.value as string})} />
    </div>
}

function SimpleSellableEditor({source, setSource}: SellableSourceEditorArgs<SimpleSellable>) {
    let drop = onItemDrop((item)=>{
        setSource({itemId: getItemId(item)})
    })
    let {result, loading} = usePromise(async ()=>source.itemId ? getItem(source.itemId) : null, [source.itemId])
    return <div onDrop={drop}>
        Item ID: {JSON.stringify(source.itemId)}
        {result ? <ItemViewer item={result} /> : null}
    </div>
}

function EditorChild({source, setSource}: SellableSourceEditorArgs<SellableSource>) {
    let ChildObj: any = null
    if(isSimpleSellable(source)) {
        ChildObj = SimpleSellableEditor
    } else if(isReferencedSellable(source)) {
        ChildObj = ReferencedSellableEditor
    } else if(isFilterSellable(source)) {
        ChildObj = FilterSellableEditor
    } else if(isNestedSellable(source)) {
        ChildObj = NestedSellableEditor
    } else {
        return <div>No type found</div>
    }
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
    setSource: (source: SellableSource)=>void
}
export default function SellableSourceEditor({source, setSource}: SellableSourceEditorArgs<SellableSource>) {
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
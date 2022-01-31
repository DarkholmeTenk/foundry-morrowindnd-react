import {addItemToSatchel, getSatchelFlag, getSatchelItems} from "./SatchelItemFlags";
import useSelf from "../../Util/Components/SelfActorSelector";
import {usePromise} from "../../Util/Helper/PromiseHelper";
import {CircularProgress} from "@material-ui/core";
import {onDrop} from "../../Util/Helper/DropHelper";
import {getItemId} from "../../Util/Identifiers/ItemID";
import {useEntity} from "../../Util/Helper/EntityHelper";
import {useMemo} from "react";
import ItemTable from "../../Util/Components/ItemTable/ItemTable";
import {ItemColumnDefaults} from "../../Util/Components/ItemTable/ItemTableDefaults";

function SatchelItemTable({satchel, items}) {
    return <div>
        <ItemTable
            items={items}
            columns={ItemColumnDefaults}
        />
    </div>
}

export default function SatchelSheetComponent({item}) {
    let {value: itemObj} = useEntity({type: "Item", entity: item})
    let satchel = useMemo(()=>getSatchelFlag(itemObj), [itemObj])
    let {actor: self, component: selfSelector} = useSelf()
    let {result: items, loading} = usePromise(()=>getSatchelItems(satchel), [itemObj])
    let onDropHandler = onDrop((i)=> {
        if(i instanceof Item) {
            let id = getItemId(i)
            addItemToSatchel(satchel, id, i.qty())
        }
    })
    console.log(item)
    return <div onDrop={onDropHandler}>
        {JSON.stringify(item.isOwner)}
        {selfSelector}
        {JSON.stringify(item.data)}
        {loading ? <CircularProgress /> : <SatchelItemTable satchel={satchel} items={items} /> }
    </div>
}
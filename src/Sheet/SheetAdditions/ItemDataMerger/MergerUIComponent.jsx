import {useContext, useState} from "react";
import {doMerge} from "./Merger";
import {Button} from "@material-ui/core";
import ApplicationContext from "../../../Util/React/core/ApplicationContext";

function SingleRow({selected, setSelected, item, matchedItem, differences}) {
    return <div>
        <input type="checkbox" checked={selected} onChange={(e)=>setSelected(e.target.checked)} />
        {item.name}
        <pre>
            {JSON.stringify(differences, null, 2)}
        </pre>
    </div>
}

function getInitialSelected(mappings) {
    let val = {}
    Object.keys(mappings).forEach(key=>val[key] = true)
    return val
}

export default function MergerUIComponent({actor, mappings}) {
    let app = useContext(ApplicationContext)
    let [selected, setSelected] = useState(()=>getInitialSelected(mappings))
    return <div>
        {Object.keys(mappings).map(itemId=>{
            let item = actor.getOwnedItem(itemId)
            let {item: mappedItem, differences} = mappings[itemId]
            let setRowSelected = (v)=>setSelected({...selected, [itemId]: v})
            return <SingleRow selected={selected[itemId]} setSelected={setRowSelected} item={item} matchedItem={mappedItem} differences={differences} key={itemId} />
        })}
        <Button onClick={async ()=>{
            await doMerge(actor, mappings, selected)
            app.close()
        }}>Merge</Button>
    </div>
}
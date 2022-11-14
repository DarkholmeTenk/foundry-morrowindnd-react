import {Tab, Tabs} from "@material-ui/core";
import {useState} from "react";
import AlchemyCraftingCoordinator from "./Alchemy/AlchemyCraftingCoordinator";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";

let tabs = [
    {
        id: "Alchemy",
        sheet: AlchemyCraftingCoordinator
    }
]

export default function CraftingSheetComponent() {
    let actor = useNewSelf()
    let [tab, setTab] = useState(tabs[0].id)
    let tabComps = tabs.map((t)=><Tab value={t.id} label={t.id} />)
    let CurrentTab = (tabs.find(x=>x.id === tab) ?? tabs[0])!.sheet
    return <div>
        <Tabs value={tab} onChange={(e,v)=>setTab(v)}>
            {tabComps}
        </Tabs>
        <CurrentTab self={actor} />
    </div>
}
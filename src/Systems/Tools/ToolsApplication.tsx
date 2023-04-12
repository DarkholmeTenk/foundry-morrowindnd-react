import {FunctionComponent, Suspense, useState} from "react";
import {CircularProgress} from "@mui/material";
import TravelPlanner from "Systems/Traveller/Planner/TravelPlanner";
import Styles from "./ToolsApplication.module.scss"
import {SuspenseLayer} from "Util/Suspense/SuspenseLoadIndicator";
import {TravelJourneyBuilder} from "Systems/Traveller/JourneyBuilder/TravelJourneyBuilder";
import NPCMakerComponent from "Systems/NPCMaker/NPCMakerComponent";
import {useIsGm} from "Util/React/core/GmContext";
import {MaterialsComponent} from "Systems/Tools/Materials/MaterialsComponent";

interface  Tool {
    id: string
    name: string
    component: FunctionComponent,
    gmOnly?: boolean
}
const Tools: Tool[] = [
    {
        id: "travel",
        name: "Travel Guide",
        component: TravelPlanner
    },
    {
        id: "journey",
        name: "Journey Builder",
        component: TravelJourneyBuilder
    },
    {
        id: "npcmaker",
        name: "NPC Maker",
        component: NPCMakerComponent,
        gmOnly: true
    },
    {
        id: "materials",
        name: "Material Display",
        component: MaterialsComponent
    }
]

export function ToolsApplication() {
    let [tool, setTool] = useState("travel")
    let currentTool = Tools.find(x=>x.id === tool) ?? {id: "err", name: "err", component: ()=><div>ERROR!</div>}
    let isGm = useIsGm()
    let {component: Component} = currentTool
    let classNames = (active: boolean)=>active ? Styles.Active : ""
    let myTools = (isGm ? Tools : Tools.filter(x=>!x.gmOnly))
    return <div className={Styles.ToolsApplication}>
        <aside className={"sidebar flex-col " + Styles.Sidebar}>
            <nav>
                {myTools.map((t)=><a className={classNames(t.id === tool)} key={t.id} onClick={()=>setTool(t.id)}>{t.name}</a>)}
            </nav>
        </aside>
        <article>
            <SuspenseLayer>
                <Component />
            </SuspenseLayer>
        </article>
    </div>
}


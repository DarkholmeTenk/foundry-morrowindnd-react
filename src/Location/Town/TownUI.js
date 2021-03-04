import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication";
import {getFlag} from "../../Util/FlagHelper";
import TownSettingsSheet from "./TownSettingsSheet";
import {TownScene} from "./TownScene";
import TownSheet from "./TownSheet";

Hooks.on("journalSheetMenuItems", async (addMenuItem, app)=>{
    let journal = app.object
    let [flag, setFlag] = getFlag(journal, "town_settings", {})
    if(game.user.isGM) {
        addMenuItem({
            name: "Set Town Settings",
            icon: '<i class="fas fa-hand-sparkles"></i>',
            callback: ()=>{
                new SimpleReactApplication(<TownSettingsSheet originalFlag={flag} setOriginalFlag={setFlag}/>,
                    {width:500, height: 600, title: `Town settings: ${journal.name}` }).render(true)
            }
        })
    }
    if(flag.size) {
        addMenuItem({
            name: "Town",
            icon: "",
            callback: async ()=>{
                let townscene = await TownScene.getTownScene(journal.name)
                if(townscene) {
                    new SimpleReactApplication(<TownSheet townScene={townscene} />,
                        {width: 500, height: 600, title: `Town: ${journal.name}`}).render(true)
                }
            }
        })
    }
})
import {getFlag} from "../../Util/Helper/FlagHelper";
import TownSettingsSheet from "./TownSettingsSheet";
import {TownScene} from "./TownScene";
import TownSheet from "./TownSheet";
import {setupSetting} from "../../Constants/Config";
import {SimpleReactApplication} from "../../Util/React/ReactApplication";

const IS_ENABLED = setupSetting({
    key: "Town.UI.Enabled",
    name: "Enable Town UI",
    default: false,
    type: Boolean,
})

Hooks.on("journalSheetMenuItems", async (addMenuItem, app)=>{
    if(!IS_ENABLED.value) return
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

Hooks.on("getSceneControlButtons", (controls) => {
    if(!IS_ENABLED.value) return
    console.log("Getting scene controls")
    controls.find(x=>x.name==="token").tools.push({
        name: "morrowindnd.town",
        title: "morrowindnd.town",
        icon: "fas fa-city",
        visible: true,
        button: true,
        onClick: () => {
        }
    })
});

import {getTravelData, TravelDataFlagKey} from "./NoteDataUtil"
import { p2pRoutes } from "../const"
import LogFactory from "../../../Util/Logging";
import {SimpleReactApplication} from "../../../Util/React/ReactApplication";
import TravelDataForm, {OtherNode} from "../Form/TravelDataForm";
import {TravelData} from "./NoteData";
import {FLAG_SCOPE} from "../../../Util/Helper/FlagHelper";
import {migrate} from "../../../Util/Helper/FlagMigrationHelper";

const log = LogFactory("Traveller_NoteData")

function internalFlatten(data) {
    Object.keys(data).forEach(key=>{
        let val = data[key]
        if(typeof val === "object") {
            let isArr = Object.keys(val).length > 0 && Object.keys(val).every(key=>!isNaN(parseInt(key)))
            if(isArr) {
                data[key] = Object.values(val)
            } else {
                internalFlatten(val)
            }
        }
    })
}

export async function fixReciprocal(myEntry: JournalEntry, myTravel: TravelData, otherNodes: OtherNode[]) {
    let promises = otherNodes.map(async ({entry, travel})=>{
        let changed = false
        p2pRoutes.forEach(({id})=>{
            if(!travel[id]) {
                travel[id] = []
            }
            if(!myTravel[id]) {
                myTravel[id] = []
            }
            let isOtherInMe = myTravel[id].find(e=>e.target == entry.id)
            let amIInOther = travel[id].find(e=>e.target == myEntry.id)
            if(isOtherInMe && !amIInOther) {
                log(`Travel ${id} not in other [${entry.name}] fixing`)
                travel[id].push({...isOtherInMe, target: myEntry.id})
                changed = true
            } else if(!isOtherInMe && amIInOther) {
                log(`Travel ${id} in other [${entry.name}] after removal`)
                travel[id] = travel[id].filter(e=>e.target != myEntry.id)
                changed = true
            }
        })
        if(changed) {
            await entry.setFlag(FLAG_SCOPE, TravelDataFlagKey, travel)
        }
    })
    await Promise.all(promises)
}

Hooks.on('journalSheetMenuItems', (addMenuItem, app, html, data) => {
    log("Opening journal sheet")
    addMenuItem({
        name: game.i18n.localize('Traveller.NoteButton'),
        icon: '<i class="fas fa-clipboard"></i>',
        callback: ()=>{
            let note = app.object as JournalEntry
            let travel = getTravelData(note)!
            let otherNodes = game.journal.map(entry=>{
                let travel = getTravelData(entry)
                if(!travel) return null
                return { entry: entry as JournalEntry, travel}
            }).filter((x)=>x && x.travel.isTravel && x.entry != note)
                .map(x=>x!)
            new SimpleReactApplication(<TravelDataForm note={note} travelData={travel} otherNodes={otherNodes} />, {
                width: 800,
                height: 600
            }).render(true)
        }
    })
});

Hooks.on("ready", ()=>migrate(game.journal, {oldScope: "traveller"}))
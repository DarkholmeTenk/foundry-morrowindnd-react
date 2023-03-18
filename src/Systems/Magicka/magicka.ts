import {wrapUpdateActor, wrapUpdateToken} from "./wrapper/entity-spell-wrapper"
import { wrapItem } from "./wrapper/item-wrapper";
import { addCostTable } from "./wrapper/actor-sheet-wrapper";
import { registerSettings } from "./config";
import {getMagicka} from "./MagickaFlag";
import {FLAG_SCOPE} from "../../Util/Helper/FlagHelper";
import {wrapTokenAttributes} from "./wrapper/TokenAttributesWrapper";
import {wrapActorSheets} from "./wrapper/ActorSheetWrapper";


Hooks.on('ready', async ()=>{
    console.log("MOSS | Getting ready")

    wrapItem()
})

Hooks.on('init', registerSettings)

Hooks.on("preUpdateActor", wrapUpdateActor)
Hooks.on("preUpdateToken", wrapUpdateToken)
Hooks.on("renderActorSheet", addCostTable);
Hooks.on("renderTokenSheet", addCostTable);

export function magickaReady() {
    wrapTokenAttributes()
    wrapActorSheets()
}
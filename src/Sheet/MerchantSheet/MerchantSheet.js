import {ReactActorSheet} from "../../Util/React/SheetHelper";
import MerchantSheetComponent from "./MerchantSheetComponent";

export class MerchantSheet extends ReactActorSheet {
    getComponent({npc}) {
        return <MerchantSheetComponent merchant={npc} />
    }
}

Actors.registerSheet("morrowindnd", MerchantSheet, {
    types: ["npc"],
    makeDefault: false
});
import {ReactActorSheet} from "Util/React/SheetHelper";
import MerchantSheetComponent from "./MerchantSheetComponent";

export class MerchantSheet extends ReactActorSheet {
    getComponent() {
        return <MerchantSheetComponent merchant={this.object} />
    }
}

Actors.registerSheet("morrowindnd", MerchantSheet, {
    types: ["npc"],
    makeDefault: false
});
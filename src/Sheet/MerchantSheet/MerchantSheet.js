import {ReactActorSheet} from "Util/React/SheetHelper";
import MerchantSheetComponent from "./MerchantSheetComponent";

export class MerchantSheet extends ReactActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            height: 940
        })
    }

    getComponent() {
        return <MerchantSheetComponent merchant={this.object} />
    }
}

Actors.registerSheet("morrowindnd", MerchantSheet, {
    types: ["npc"],
    makeDefault: false
});
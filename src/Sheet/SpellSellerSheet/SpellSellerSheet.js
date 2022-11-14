import {ReactActorSheet} from "../../Util/React/SheetHelper";
import SpellSellerSheetComponent from "./SpellSellerSheetComponent";

export class SpellSellerSheet extends ReactActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            height: super.defaultOptions.height + 120
        })
    }

    getComponent() {
        return <SpellSellerSheetComponent merchant={this.object}/>
    }
}

Actors.registerSheet("morrowindnd", SpellSellerSheet, {
    types: ["npc"],
    makeDefault: false
});
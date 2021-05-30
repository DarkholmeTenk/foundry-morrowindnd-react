import {ReactActorSheet} from "../../Util/React/SheetHelper";
import SpellSellerSheetComponent from "./SpellSellerSheetComponent";

export class SpellSellerSheet extends ReactActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            height: super.defaultOptions.height + 120
        })
    }

    getComponent({npc, self}) {
        return <SpellSellerSheetComponent merchant={npc} self={self}/>
    }
}

Actors.registerSheet("morrowindnd", SpellSellerSheet, {
    types: ["npc"],
    makeDefault: false
});
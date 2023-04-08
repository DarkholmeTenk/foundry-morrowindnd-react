import LootSheetComponent from "./LootSheetComponent.tsx";
import {ReactActorSheet} from "Util/React/SheetHelper";

export class LootSheet extends ReactActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: super.defaultOptions.width + 10,
            height: super.defaultOptions.height + 140
        })
    }

    getComponent() {
        return <LootSheetComponent npc={this.object}/>
    }
}

Actors.registerSheet("morrowindnd", LootSheet, {
    types: ["npc"],
    makeDefault: false
});
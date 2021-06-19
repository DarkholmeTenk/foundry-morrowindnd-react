import LootSheetComponent from "./LootSheetComponent.tsx";
import {ReactActorSheet} from "../../Util/React/SheetHelper";

export class LootSheet extends ReactActorSheet {
    getComponent({npc, self}) {
        return <LootSheetComponent npc={npc} self={self}/>
    }
}

Actors.registerSheet("morrowindnd", LootSheet, {
    types: ["npc"],
    makeDefault: false
});
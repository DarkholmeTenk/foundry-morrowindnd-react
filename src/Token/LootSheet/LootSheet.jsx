import LootSheetComponent from "./LootSheetComponent";
import {ReactActorSheet} from "../../Util/Helper/SheetHelper";

export class LootSheet extends ReactActorSheet {
    getComponent({npc, self}) {
        return <LootSheetComponent npc={npc} self={self}/>
    }
}

Actors.registerSheet("morrowindnd", LootSheet, {
    types: ["npc"],
    makeDefault: false
});
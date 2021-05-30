import {ReactActorSheet} from "../../Util/React/SheetHelper";
import MerchantSheetComponent from "./MerchantSheetComponent";

export class MerchantSheet extends ReactActorSheet {
    getComponent({npc, self}) {
        return <MerchantSheetComponent merchant={npc} self={self}/>
    }
}

Actors.registerSheet("morrowindnd", MerchantSheet, {
    types: ["npc"],
    makeDefault: false
});
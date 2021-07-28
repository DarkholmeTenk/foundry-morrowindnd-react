import {ReactActorSheet, ReactItemSheet} from "../../Util/React/SheetHelper";
import SatchelSheetComponent from "./SatchelSheetComponent";

export class SatchelSheet extends ReactItemSheet {
    getComponent({item}) {
        return <SatchelSheetComponent item={item}/>
    }
}

Items.registerSheet("morrowindnd", SatchelSheet, {
    types: ["backpack"],
    makeDefault: false
});
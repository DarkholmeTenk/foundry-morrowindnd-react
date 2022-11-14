import {ReactItemSheet} from "../../Util/React/SheetHelper";
import SatchelSheetComponent from "./SatchelSheetComponent";

export class SatchelSheet extends ReactItemSheet {
    getComponent() {
        return <SatchelSheetComponent item={this.object}/>
    }
}

Items.registerSheet("morrowindnd", SatchelSheet, {
    types: ["backpack"],
    makeDefault: false
});
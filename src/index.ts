import "./NPCMaker/NPCMaker"
import "./RollTable"
import "./Token"
import "./Item"
import "./Location"
import "./Systems"
import "./Constants"
import "./Util"
import "./Sheet"
import "./Settings"
import "./index.scss"
import {BaseItemData, ClassItem, Consumable, Spell} from "./DndTypes/ItemTypes";
import {ItemDataBaseProperties} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

declare global {
    interface LenientGlobalVariableTypes {
        game: never; // the type doesn't matter
    }
    interface Item {
        consumable: ()=>Consumable,
        subData: ()=>BaseItemData,
        spell: ()=>Spell,
        clz: ()=>ClassItem,
        qty: ()=>number,
        weight: ()=>number,
    }
}
Item.prototype.consumable = function () { return this.data.data as Consumable }
Item.prototype.spell = function () { return this.data.data as Spell }
Item.prototype.clz = function () { return this.data.data as ClassItem }
Item.prototype.weight = function () { return (this as any).data?.data?.weight ?? 0 }
Item.prototype.subData = function() { return (this.data?.data) as BaseItemData}
Item.prototype.qty = function(): number {
    let r = (this.data.data as any).quantity as number
    if(!r) return 0
    return r
}

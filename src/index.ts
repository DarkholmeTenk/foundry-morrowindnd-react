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
import Consumable = data5e.Consumable;
import Spell = data5e.Spell;
import {TableResultType} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs";

declare global {
    interface LenientGlobalVariableTypes {
        game: never; // the type doesn't matter
    }
    interface Item {
        qty: ()=>number,
        weight: ()=>number,
        consumable: ()=>data5e.Consumable,
        spell: ()=>data5e.Spell,
        clz: ()=>data5e.Class
    }
    interface TableResult {
        data: {
            type: TableResultType,
            text?: string
            collection?: string,
            resultId?: string
        }
    }
    interface TableRollResult {
        roll: Roll,
        results: TableResult[]
    }
    interface RollTable {
        roll: ()=>Promise<TableRollResult>
    }
}
Item.prototype.consumable = function () { return this.data.data as Consumable }
Item.prototype.spell = function () { return this.data.data as Spell }
Item.prototype.clz = function () { return this.data.data as data5e.Class }
Item.prototype.weight = function () { return (this as any).data?.data?.weight ?? 0 }
Item.prototype.qty = function(): number {
    let r = (this.data.data as any).quantity as number
    if(!r) return 0
    return r
}

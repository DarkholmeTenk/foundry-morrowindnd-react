import {getRollTableData, RollData} from "Systems/RollTable/Rolling/TableHelper";
import LogFactory from "Util/Logging";
import {getRollTableFlag} from "Systems/RollTable/FlagData/RollTableFlag";

const log = LogFactory("TableRoller")

export class EncapsulatingRollData implements RollData {
    constructor(readonly rolls: RollData[], private readonly modifiers: RollData[]) {
    }

    applyItemModification(itemData: any) {
        return this.rolls.reduce((acc, value)=>value.applyItemModification(acc), itemData)
    }

    getItemData(): any[] {
        return this.rolls.flatMap(r=>r.getItemData())
            .map(itemData=>{
                let mods = this.modifiers || []
                return mods.reduce((acc, value)=>value.applyItemModification(acc) ,itemData)
            })
    }

    getModifications(actorData: any): { [p: string]: any } {
        let map = {};
        this.rolls.forEach(r=>{
            let mods = r.getModifications(actorData)
            Object.assign(map, mods)
        })
        return map
    }

    multiply(num: number): RollData {
        let newRolls = this.rolls.map(r=>r.multiply(num))
        let newMods = this.modifiers.map(r=>r.multiply(num))
        return new EncapsulatingRollData(newRolls, newMods)
    }
}

function getRollTable(x: string | RollTable | undefined): RollTable | undefined {
    if(!x) return undefined
    if(x instanceof RollTable) return x
    return game.tables.get(x)
}

export default async function doRollTable(id: string | RollTable): Promise<RollData[]> {
    let rollTable = getRollTable(id)
    if(!rollTable) return []
    let [{tableId}] = getRollTableFlag(rollTable)
    let roll = await rollTable.roll()
    let results = (await Promise.all(roll.results.map(async result=>{
        return await getRollTableData(result)
    }))).flatMap(i=>i)
    log("Got results", results)
    let modifiers = await doRollTable(tableId!)
    log("Got modifiers", modifiers)
    if(modifiers) {
        return [new EncapsulatingRollData(results, modifiers)]
    } else {
        return results
    }
}
import doRollTable from "Systems/RollTable/Rolling/TableRoller";
import LogFactory from "Util/Logging";
import {callRoll} from "Util/Helper/RollHelper";
import {getTokenLootGeneratorFlag, RollTableChoice} from "Systems/TokenLootGenerator/TokenLootGeneratorFlag";
import {CreateTokenMutateArgs} from "Util/Hooks/TokenMutateHooks";

const log = LogFactory("TokenLootGenerator")

function fixTokenModifications(o: any): any {
    let nO = {}
    Object.keys(o).forEach(k=>{
        if(k.startsWith("actorData")) {
            nO[k] = o[k]
        } else {
            nO[`actorData.${k}`] = o[k]
        }
    })
    return nO
}

Hooks.on("createTokenMutate", async (update, {token}: CreateTokenMutateArgs)=>{
    let actor = token.actor
    update(async ()=>{
        let [flag] = getTokenLootGeneratorFlag(actor)
        let rollTableIds: RollTableChoice[] = flag.rollTableIds
        let rollResult = (await Promise.all(rollTableIds.map(async ({id: rollTableId, qty})=>{
            if(!rollTableId) return []
            let result = await callRoll(qty)
            let data = await Promise.all(Array(result).fill("").map(()=>doRollTable(rollTableId)))
            let flatData = data.flatMap(i=>i)
            log.debug("Items rolled", flatData, result)
            return flatData
        }))).flatMap(i=>i)
        let items = rollResult.flatMap(d=>d.getItemData())
        let modifications = {}
        rollResult.map(x=>x.getModifications(actor._source)).forEach(modObj=>Object.assign(modifications, fixTokenModifications(modObj)))
        log("Giving NPC items", token, items, modifications)
        return {"items": items, ...modifications}
    })
})
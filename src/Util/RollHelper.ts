import {registerSocket} from "../Socket/SocketHelper";

export interface RollResult {
    actor: string,
    roll: Roll
}

interface CurrentAsk {
    resolve: (responses: RollResult[])=>void
    requests: RollRequest[]
    responses: RollResult[]
}

let currentAsk: CurrentAsk = null

function resolveCurrentAsk() {
    if(currentAsk.responses.length === currentAsk.requests.length) {
        currentAsk.resolve(currentAsk.responses)
        currentAsk = null
    }
}

export interface RollRequest {
    actor: string,
    skill: string
    options: any
}

const socket = registerSocket<RollRequest[]>("RollRequest", (data)=>{
    data.filter(r=>r.actor === game.user.character?.id).forEach(async (r)=>{
        let value = await (game.user.character as any).rollSkill(r.skill, r.options)
        rollSocket({actor: r.actor, result: JSON.stringify(value)})
    })
})

interface RollResponse {
    actor: string,
    result: string
}

const rollSocket = registerSocket<RollResponse>("RollResponse", (data)=>{
    if(!currentAsk) return;
    currentAsk.responses.push({
        actor: data.actor,
        roll: Roll.fromJSON(data.result)
    })
    resolveCurrentAsk()
})

interface RequestOptions {
    timeout?: number
}

export async function requestRolls(requests: RollRequest[], options: RequestOptions = {}): Promise<RollResult[]> {
    return new Promise((resolve)=>{
        currentAsk = {
            resolve,
            requests,
            responses: []
        }
        socket(requests)
    })
}
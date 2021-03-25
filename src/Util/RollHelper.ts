import {registerSocket} from "../Socket/SocketHelper";

interface CurrentAsk {
    resolve: (responses: RollResponse[])=>void
    requests: RollRequest[]
    responses: RollResponse[]
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

export interface RollResponse {
    actor: string,
    result: string
}

export type RollResult = {[actorId: string]: Roll}
export function processRollResponse(responses: RollResponse[]): RollResult {
    let map = {}
    responses.forEach(({actor, result})=>{
        map[actor] = Roll.fromJSON(result)
    })
    return map
}

const rollSocket = registerSocket<RollResponse>("RollResponse", (data)=>{
    if(!currentAsk) return;
    currentAsk.responses.push(data)
    resolveCurrentAsk()
})

interface RequestOptions {
    timeout?: number
}

export async function requestRolls(requests: RollRequest[], options: RequestOptions = {}): Promise<RollResponse[]> {
    return new Promise((resolve)=>{
        currentAsk = {
            resolve,
            requests,
            responses: []
        }
        socket(requests)
    })
}
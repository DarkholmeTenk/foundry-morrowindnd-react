import { registerSocket } from "../Socket/SocketHelper";
let currentAsk = null;
function resolveCurrentAsk() {
    if (currentAsk.responses.length === currentAsk.requests.length) {
        currentAsk.resolve(currentAsk.responses);
        currentAsk = null;
    }
}
const socket = registerSocket("RollRequest", (data) => {
    data.filter(r => r.actor === game.user.character?.id).forEach(async (r) => {
        let value = await game.user.character.rollSkill(r.skill, r.options);
        rollSocket({ actor: r.actor, result: JSON.stringify(value) });
    });
});
export function processRollResponse(responses) {
    let map = {};
    responses.forEach(({ actor, result }) => {
        map[actor] = Roll.fromJSON(result);
    });
    return map;
}
const rollSocket = registerSocket("RollResponse", (data) => {
    if (!currentAsk)
        return;
    currentAsk.responses.push(data);
    resolveCurrentAsk();
});
export async function requestRolls(requests, options = {}) {
    return new Promise((resolve) => {
        currentAsk = {
            resolve,
            requests,
            responses: []
        };
        socket(requests);
    });
}

export function getPackId(pack) {
    return { package: pack.metadata.package, name: pack.metadata.name };
}
export function getPack(id) {
    let { package: p, name } = id;
    return game.packs.get(`${p}.${name}`);
}
let cache = {};
function toString(id) {
    return `${id.package}.${id.name}`;
}
export function loadPack(id) {
    let idString = toString(id);
    if (!cache[idString]) {
        cache[idString] = getPack(id).getContent();
    }
    return cache[idString];
}
export async function loadPacks(ids) {
    let entities = await Promise.all(ids.map(id => loadPack(id)));
    return entities.flatMap(i => i);
}

export function getActorId(actor) {
    if (actor.isToken) {
        return {
            tokenId: actor.token.id,
            sceneId: actor.token.scene.id
        };
    }
    else {
        return {
            actorId: actor.id
        };
    }
}
function isTokenID(id) {
    return id.sceneId !== undefined;
}
export function getActor(id) {
    if (isTokenID(id)) {
        let scene = game.scenes.get(id.sceneId);
        // @ts-ignore
        let token = scene.getEmbeddedEntity("Token", id.tokenId);
        return new Token(token, scene).actor;
    }
    else {
        return game.actors.get(id.actorId);
    }
}

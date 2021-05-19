export interface SceneTokenId {
    sceneId: string,
    tokenId: string
}
export interface RawActorId {
    actorId: string
}

export type ActorId = SceneTokenId | RawActorId

export function getActorId(actor: Actor): ActorId {
    if(actor.isToken) {
        return {
            tokenId: actor.token.id,
            sceneId: actor.token.scene.id
        }
    } else {
        return {
            actorId: actor.id
        }
    }
}

function isTokenID(id: ActorId): id is SceneTokenId {
    return (id as SceneTokenId).sceneId !== undefined
}

export function getActor(id: ActorId) {
    if(isTokenID(id)) {
        let scene = game.scenes.get(id.sceneId)
        // @ts-ignore
        let token = scene.getEmbeddedEntity("Token", id.tokenId)
        return new Token(token, scene).actor
    } else {
        return game.actors.get(id.actorId)
    }
}
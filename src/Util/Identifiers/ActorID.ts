export interface SceneTokenId {
    sceneId: string,
    tokenId: string
}
export interface RawActorId {
    actorId: string
}

export type ActorId = SceneTokenId | RawActorId
export type ActorSource = Actor | Token | TokenDocument | ActorId

export function getActorId(actor: Actor): ActorId {
    if(actor.isToken) {
        return {
            tokenId: actor.token!.id!,
            sceneId: actor.token!.parent!.id!
        }
    } else {
        return {
            actorId: actor.id!
        }
    }
}

function isTokenID(id: ActorId): id is SceneTokenId {
    return (id as SceneTokenId).sceneId !== undefined
}

export function getActor(source: ActorSource): Actor {
    if(source instanceof Actor) {
        return source
    } else if(source instanceof Token || source instanceof TokenDocument) {
        return source.actor!
    } else if(isTokenID(source)) {
        let scene = game.scenes!.get(source.sceneId)
        // @ts-ignore
        let token = scene.tokens.get(source.tokenId)
        return token!.actor!
    } else {
        return game.actors!.get(source.actorId)!
    }
}
import {setupFolder} from "../../Util/Helper/FolderHelper";

interface TownSize {
    name: string
}

export const TownSizes: TownSize[] = [
    {name: "Outpost"},
    {name: "Town"},
    {name: "City"},
    {name: "Capital"}
]

export class TownScene {
    constructor(public readonly townName: string, public readonly scene: Scene) {
    }

    getToken(data): Token {
        let token = new Token(data)
        token.scene = this.scene
        return token;
    }

    getMerchants(): Token[] {
        return this.scene.getEmbeddedCollection("Token")
            .map((d)=>this.getToken(d))
            //.filter(t=>isActorMerchant(t.actor))
    }

    static async getTownScene(townName: string): Promise<TownScene> {
        let scene = game.scenes.getName(townName)
        if(!scene) {
            if(game.user.isGM) {
                let folder = await setupFolder("towns", "Scene")
                scene = await Scene.create({name: townName, folder, navigation: false})
            } else {
                ui.notifications.error(`No town scene found for ${townName}`)
                return;
            }
        }
        return new TownScene(townName, scene)
    }
}
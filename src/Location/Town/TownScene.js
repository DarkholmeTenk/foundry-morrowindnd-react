import { setupFolder } from "@darkholme/foundry-react-core/src/Util/FolderHelper";
import { isActorMerchant } from "../../Util/LootSheetHelper";
export const TownSizes = [
    { name: "Outpost" },
    { name: "Town" },
    { name: "City" },
    { name: "Capital" }
];
export class TownScene {
    constructor(townName, scene) {
        this.townName = townName;
        this.scene = scene;
    }
    getToken(data) {
        let token = new Token(data);
        token.scene = this.scene;
        return token;
    }
    getMerchants() {
        return this.scene.getEmbeddedCollection("Token")
            .map((d) => this.getToken(d))
            .filter(t => isActorMerchant(t.actor));
    }
    static async getTownScene(townName) {
        let scene = game.scenes.getName(townName);
        if (!scene) {
            if (game.user.isGM) {
                let folder = await setupFolder("towns", "Scene");
                scene = await Scene.create({ name: townName, folder, navigation: false });
            }
            else {
                ui.notifications.error(`No town scene found for ${townName}`);
                return;
            }
        }
        return new TownScene(townName, scene);
    }
}
